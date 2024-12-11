import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import MealUpload from "@/src/components/Feed/MealUpload";

export default async function Home() {
  const { currentUser, firebaseServerApp } = await getAuthenticatedAppForUser();

  return (
    <main className="main__restaurant">
      {currentUser ? (
        <MealUpload
          firebaseServerApp={firebaseServerApp}
          userId={currentUser.uid}
        />
      ) : (
        <p>Please login!</p>
      )}
    </main>
  );
}
