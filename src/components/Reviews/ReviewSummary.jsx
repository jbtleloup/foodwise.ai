import { getVertexAI, getGenerativeModel } from "firebase/vertexai";
import { getReviewsByRestaurantId } from "@/src/lib/firebase/firestore.js";
import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp";
import { getFirestore } from "firebase/firestore";

export async function GeminiSummary({ restaurantId }) {
  const { firebaseServerApp } = await getAuthenticatedAppForUser();
  const reviews = await getReviewsByRestaurantId(
    getFirestore(firebaseServerApp),
    restaurantId
  );

  const vertexAi = getVertexAI(firebaseServerApp)
  const model = getGenerativeModel(vertexAi, {
    model: "gemini-1.5-flash",
    safety_settings: [
      // {
      //   category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      //   threshold: HarmBlockThreshold.BLOCK_NONE,
      // },
    ],
  });

  const reviewSeparator = "@";
  const prompt = `
    Based on the following restaurant reviews, 
    where each review is separated by a '${reviewSeparator}' character, 
    create a one-sentence summary of what people think of the restaurant. 
    
    Here are the reviews: ${reviews.map((review) => review.text).join(reviewSeparator)}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return (
      <div className="restaurant__review_summary">
        <p>{text}</p>
        <p>✨ Summarized with Gemini</p>
      </div>
    );
  } catch (e) {
    console.error(e);
    if (e.message.includes("403 Forbidden")) {
      return (
        <p>
          This service account doesn&apos;t have permission to talk to Gemini
          via Vertex
        </p>
      );
    } else {
      return <p>Error contacting Gemini</p>;
    }
  }
}

export function GeminiSummarySkeleton() {
  return (
    <div className="restaurant__review_summary">
      <p>✨ Summarizing reviews with Gemini...</p>
    </div>
  );
}