import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import MealDetails from "@/src/components/Feed/MealDetails";

export default async function Home() {
  const { currentUser, firebaseServerApp } = await getAuthenticatedAppForUser();

  return (
    <main className="main__restaurant">
      {currentUser ? (
        <MealDetails
          firebaseServerApp={firebaseServerApp}
          userId={currentUser.uid}
        />
      ) : (
        <p>Please login!</p>
      )}
    </main>
  );
}
