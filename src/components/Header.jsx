"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import {
  signInWithGoogle,
  signOut,
  onAuthStateChanged,
} from "@/src/lib/firebase/auth.js";
import { firebaseConfig } from "@/src/lib/firebase/config";

function useUserSession(user) {
  // Register the service worker that sends auth state back to server
  // The service worker is built with npm run build-service-worker
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const serializedFirebaseConfig = encodeURIComponent(
        JSON.stringify(firebaseConfig)
      );
      const serviceWorkerUrl = `/auth-service-worker.js?firebaseConfig=${serializedFirebaseConfig}`;

      navigator.serviceWorker
        .register(serviceWorkerUrl, { scope: "/", updateViaCache: "none" })
        .then((registration) => {
          console.log("scope is: ", registration.scope);
          registration.update();
        });
    }
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      return onAuthStateChanged(async (authUser) => {
        if (user?.uid === authUser?.uid) {
          return;
        }
        await navigator.serviceWorker.ready;
        await fetch(`/__/auth/wait/${authUser?.uid}`);
        window.location.reload();
      });
    }
  }, [user]);

  return user;
}

export default function Header({ initialUser }) {
  const user = useUserSession(initialUser);

  const handleSignOut = (event) => {
    event.preventDefault();
    signOut();
  };

  const handleSignIn = (event) => {
    event.preventDefault();
    signInWithGoogle();
  };

  return (
    <header>
      <Link href="/" className="logo">
        <img src="/foodwise-logo.png" alt="FriendlyEats" />
        FoodWise.ai
      </Link>
      {user ? (
        <>
          <Navbar />
          <div className="profile">
            <p>
              <img
                className="profileImage"
                src={user.photoURL || "/profile.svg"}
                alt={user.email}
              />
              {user.displayName}
            </p>

            <div className="menu">
              ...
              <ul>
                <li>{user.displayName}</li>

                <li>
                  <a href="#" onClick={handleSignOut}>
                    Sign Out
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </>
      ) : (
        <div className="profile">
          <a href="#" onClick={handleSignIn}>
            <img src="/profile.svg" alt="A placeholder user image" />
            Sign In with Google
          </a>
        </div>
      )}
    </header>
  );
}

export function Navbar() {
  return (
    <nav>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/feed">Feed</Link>
        </li>
        <li>
          <Link href="/feed/add">Add</Link>
        </li>
      </ul>
    </nav>
  );
}
