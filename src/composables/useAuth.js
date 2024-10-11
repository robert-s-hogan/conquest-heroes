// src/composables/useAuth.js
import { auth } from "@/firebase/firebaseConfig";
import { signOut } from "firebase/auth";

export const useAuth = () => {
  const logout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return { logout };
};
