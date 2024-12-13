"use client";
import { updateMealImage } from "@/src/lib/firebase/storage";
import { useState } from "react";
import { handleMealFormSubmission } from "@/src/app/actions.js";
import { getVertexAI, getGenerativeModel } from "firebase/vertexai";
import { firebaseApp } from "@/src/lib/firebase/clientApp";
import { flushSync } from "react-dom";

const initFormState = {
  ingredients: "",
  description: "",
  image: "",
  error: "",
};

// TODO: Should probably not pass these as props.
export default function MealUpload({ userId }) {
  const [formState, setFormState] = useState(initFormState);
  const [geminiAnswer, setGeminiAnswer] = useState("");
  const vertexAi = getVertexAI(firebaseApp);
  const model = getGenerativeModel(vertexAi, {
    model: "gemini-2.0-flash-exp",
    safety_settings: [
      // {
      //   category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      //   threshold: HarmBlockThreshold.BLOCK_NONE,
      // },
    ],
  });

  const updateImage = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setFormState((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
    }
  };

  // Most of this should be a server action.
  const formAction = async (formData) => {
    flushSync(() => {
      setGeminiAnswer("loading...");
    });
    try {
      const formImage = formData.get("image");
      if (!formImage.name) throw new Error("Image is required");
      const ingredients = formData.get("ingredients");
      const description = formData.get("mealDescription");

      // TODO: addOptimisticMessage(message).

      // Do some Gemini stuff.
      const prompt = `
         Can you tell how many calories this meal represents. Give me a range
         in the form <min : max>. Only send the range no other words.
         If you can't guess the calory range send back N/A.
         This is what I think the ingredients are: ${ingredients}.
         Other maybe usefull infos about the meal: ${description}.
        `;
      const imagePart = await fileToGenerativePart(formImage);
      const result = await model.generateContent([prompt, imagePart]);
      const response = result.response;
      const text = response.text();
      setGeminiAnswer(text);

      // Do not upload unvalid data.
      if (text === "N/A")
        throw new Error(
          "Gemini could not determine a range. Please, try again with another image."
        );

      // This blocks us from being full server side.
      const imageURL = await updateMealImage(userId, formImage);

      const data = {
        ingredients,
        image: imageURL,
        description,
        userId,
        range: text,
      };
      // This is a server action.
      await handleMealFormSubmission(data);
      // Reset form on success.
      resetForm();
    } catch (error) {
      console.log(error);
      setGeminiAnswer("");
      setFormState((prev) => ({ ...prev, error: error.toString() }));
    }
  };
  const resetForm = () => {
    setFormState(initFormState);
  };

  return (
    <>
      <form action={formAction} className="meal-form">
        <header className="meal-form-header">
          <h3>Add your Meal</h3>
        </header>

        <div className="meal-form-content">
          <div className="file-upload">
            <label
              onChange={(event) => updateImage(event)}
              htmlFor="upload-image"
              className="add"
            >
              <input
                name="image"
                type="file"
                id="upload-image"
                className="file-input hidden"
                accept="image/*"
              />

              <img
                className="add-image"
                src={`${formState.image || "/add.svg"}`}
                alt="Add image"
              />
            </label>
          </div>

          <article className="meal-form-info">
            <p>List ingredients</p>
            <p>
              <input
                type="text"
                name="ingredients"
                id="review"
                placeholder="20oz cod, wheat noodle, steamed carrots, sesame oil"
                value={formState.ingredients}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    ingredients: e.target.value,
                  }))
                }
                required
              />
            </p>
            <textarea
              name="mealDescription"
              id="ta-mealdescription"
              placeholder="Free form add whatever else is relevant to your meal."
              cols="80"
              rows="5"
              value={formState.description}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            ></textarea>
          </article>
        </div>

        <footer className="meal-form-footer">
          <menu>
            <p className="error">{formState.error}</p>
            <button type="button" onClick={resetForm}>
              Reset
            </button>
            <button type="submit" value="confirm" className="button--confirm">
              Submit
            </button>
          </menu>
        </footer>
      </form>
      <div className="gemini-answer">{geminiAnswer}</div>
    </>
  );
}

async function fileToGenerativePart(file) {
  const base64EncodedDataPromise = new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(",")[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
}
