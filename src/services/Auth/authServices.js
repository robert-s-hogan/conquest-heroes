// src/services/authServices.js

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

export const login = async (
  auth,
  email,
  password,
  signInFn = signInWithEmailAndPassword
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

export const logout = async (auth) => {
  try {
    await signOut(auth);
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
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error during registration:", error.message);
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred during registration.");
  }
};

export const loginWithGoogle = async (auth) => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    return userCredential.user;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error during Google login:", error.message);
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred during Google login.");
  }
};
