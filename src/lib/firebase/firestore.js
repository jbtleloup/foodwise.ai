import { collection, query, getDocs, where, addDoc } from "firebase/firestore";

export async function addMealInfo(db, mealInfo) {
  const docRef = await addDoc(collection(db, "mealInfo"), mealInfo);
  console.log("doc was created with id ", docRef.id);
}

export async function getMealsInfoByUser(db = db, userId) {
  if (!userId) return;
  let q = query(collection(db, "mealInfo"));
  q = query(q, where("userId", "==", userId));

  const results = await getDocs(q);
  return results.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data(),
      // Only plain objects can be passed to Client Components from Server Components
      // timestamp: doc.data().timestamp.toDate(),
    };
  });
}
