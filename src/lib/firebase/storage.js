import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import { storage } from "@/src/lib/firebase/clientApp";

export async function uploadImage(slug, image) {
  const filePath = `images/${slug}/${image.name}`;
  const newImageRef = ref(storage, filePath);
  await uploadBytesResumable(newImageRef, image);

  return await getDownloadURL(newImageRef);
}

export async function updateMealImage(userId, image) {
  if (!image || !image.name)
    throw new Error("A valid image has not been provided.");

  const publicImageUrl = await uploadImage(userId, image);

  return publicImageUrl;
}
