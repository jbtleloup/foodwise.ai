"use client";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

import { auth } from "@/src/lib/firebase/clientApp.js";

export function useUser() {
  const [user, setUser] = useState();

  useEffect(() => {
    return onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
    });
  }, []);

  return user;
}
