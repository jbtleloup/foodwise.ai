"use client";
import { updateMealImage } from "@/src/lib/firebase/storage";
import { useState } from "react";
import { handleMealFormSubmission } from "@/src/app/actions.js";
import { getVertexAI, getGenerativeModel } from "firebase/vertexai";

// TODO: Should probably not pass these as props.
export default function MealDetails({ userId, firebaseServerApp }) {
  const [image, setImage] = useState(null);
  const [geminiAnswer, setGeminiAnswer] = useState("");

  const vertexAi = getVertexAI(firebaseServerApp);
  const model = getGenerativeModel(vertexAi, {
    model: "gemini-1.5-flash",
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
      setImage(URL.createObjectURL(file));
    }
  };

  // Most of this should be a server action.
  const formAction = async (formData) => {
    const formImage = formData.get("image");
    // This blocks us from being full server side.
    const imageURL = await updateMealImage(userId, formImage);
    const data = {
      ingredients: formData.get("ingredients"),
      image: imageURL,
      description: formData.get("mealDescription"),
      userId,
    };
    // TODO: addOptimisticMessage(message).

    // Do some Gemini stuff.
    const prompt = `
       Can you tell how many calories this meal represents. Give me a range 
       in the form <min : max>. Only send the range no other words. 
       If you can't guess the calory range send back N/A. 
       This is what I think the ingredients are: ${data.ingredients}.
       Other maybe usefull infos about the meal: ${data.description}.
      `;
    const imagePart = await fileToGenerativePart(formImage);
    const result = await model.generateContent([prompt, imagePart]);
    const response = result.response;
    const text = response.text();
    setGeminiAnswer(geminiAnswer + text);

    // This is a server action.
    await handleMealFormSubmission(data);
    // TODO: reset the form. reset issubmited
  };

  return (
    <>
      <form action={formAction}>
        <header>
          <h3>Add your Meal</h3>
        </header>
        <div className="flex">
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
                className="file-input hidden w-full h-full"
                required
              />

              <img
                className="add-image"
                src={`${image || "/add.svg"}`}
                alt="Add image"
              />
            </label>
          </div>

          <article>
            <p>Add any info relevant to your meal!!</p>
            <p>
              <input
                type="text"
                name="ingredients"
                id="review"
                placeholder="List known ingredients here. ex: 20oz cod, wheat noodle, steamed carotts, sesame oil"
                required
                // value={review.text}
                // onChange={(e) => onChange(e.target.value, "text")}
              />
            </p>
            <textarea
              name="mealDescription"
              id="ta-mealdescription"
              placeholder="Free form add whatever is relevant to your meal."
              cols="80"
              rows="5"
            ></textarea>
          </article>
        </div>
        <footer>
          <menu>
            <button type="submit" value="confirm" className="button--confirm">
              Submit
            </button>
          </menu>
        </footer>
      </form>
      <div>{geminiAnswer}</div>
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
