import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import MealDetails from "@/src/components/Feed/MealDetails";
import { getMealsInfoByUser } from "@/src/lib/firebase/firestore.js";
import { getFirestore } from "firebase/firestore";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { currentUser, firebaseServerApp } = await getAuthenticatedAppForUser();
  const meals = await getMealsInfoByUser(
    getFirestore(firebaseServerApp),
    currentUser.uid
  );

  return (
    <main className="main__restaurant">
      {currentUser ? (
        <MealDetails initialMeals={meals} />
      ) : (
        <p>Please login!</p>
      )}
    </main>
  );
}
