// src/composables/useAuth.js
import { auth } from "@/firebase/firebaseConfig";
import {
  login as loginService,
  logout as logoutService,
  register as registerService,
  loginWithGoogle as googleLoginService,
} from "@/services/Auth/authServices";

export const useAuth = () => {
  // General login function for email/password
  const login = async (email, password) => {
    try {
      const user = await loginService(auth, email, password);
      console.log("User logged in:", {
        userName: user.displayName,
        email: user.email,
      });
      return { userName: user.displayName, email: user.email };
    } catch (error) {
      console.error("Login failed:", error.message);
      throw error;
    }
  };

  // Specific login function using signInWithPopup for Google
  const loginWithGoogle = async () => {
    try {
      const user = await googleLoginService(auth);
      console.log("User logged in with Google:", {
        userName: user.displayName,
        email: user.email,
      });
      return { userName: user.displayName, email: user.email };
    } catch (error) {
      console.error("Google login failed:", error.message);
      throw error;
    }
  };

  // Register function
  const register = async (email, password) => {
    try {
      const userCredential = await registerService(auth, email, password);
      console.log("User registered:", userCredential.user.email);
      return userCredential.user;
    } catch (error) {
      console.error("Registration failed:", error.message);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await logoutService(auth);
      console.log("User logged out");
    } catch (error) {
      console.error("Logout failed:", error.message);
      throw error;
    }
  };

  return { login, loginWithGoogle, register, logout };
};
