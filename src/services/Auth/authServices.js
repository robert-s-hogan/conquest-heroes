// src/services/authServices.js

import {
  createUserWithEmailAndPassword as defaultCreateUserWithEmailAndPassword,
  signInWithEmailAndPassword as defaultSignInWithEmailAndPassword,
  signOut as defaultSignOut,
  GoogleAuthProvider,
  signInWithPopup as defaultSignInWithPopup,
} from "firebase/auth";

export const login = async (
  auth,
  email,
  password,
  signInFn = defaultSignInWithEmailAndPassword
) => {
  try {
    const userCredential = await signInFn(auth, email, password);
    return userCredential.user;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error during login:", error.message);
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred during login.");
  }
};

export const logout = async (auth, signOutFn = defaultSignOut) => {
  try {
    await signOutFn(auth);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error during logout:", error.message);
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred during logout.");
  }
};

export const register = async (auth, email, password) => {
  try {
    // Use auth.createUserWithEmailAndPassword so that the function can work with both real and mock auth
    const userCredential = await auth.createUserWithEmailAndPassword(
      email,
      password
    );
    return userCredential;
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      console.error("Error during registration:", error.message);
      throw new Error(
        "This email is already registered. Please use another email or login."
      );
    } else {
      console.error("Error during registration:", error.message);
      throw new Error("Registration failed");
    }
  }
};

export const loginWithGoogle = async (
  auth,
  signInWithPopupFn = defaultSignInWithPopup
) => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopupFn(auth, provider);
    return userCredential.user;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error during Google login:", error.message);
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred during Google login.");
  }
};
