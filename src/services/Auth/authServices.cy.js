// src/services/authServices.cy.js

import { login, logout, register, loginWithGoogle } from "./authServices";
import { mockAuth, resetAuthMocks } from "./firebaseAuthMock";

describe("Auth Service", () => {
  beforeEach(() => {
    resetAuthMocks();
  });

  describe("login function", () => {
    it("should handle login errors correctly", async () => {
      const errorMessage = "Login failed";
      mockAuth.signInWithEmailAndPassword.rejects(new Error(errorMessage));

      try {
        await login(
          mockAuth,
          "test@example.com",
          "wrongpassword",
          mockAuth.signInWithEmailAndPassword
        );
        throw new Error("Expected promise to be rejected, but it was resolved");
      } catch (error) {
        expect(error.message).to.equal(errorMessage);
      }
    });

    it("should return user on successful login", async () => {
      const mockUser = { uid: "12345", email: "test@example.com" };
      mockAuth.signInWithEmailAndPassword.resolves({ user: mockUser });

      const result = await login(
        mockAuth,
        "test@example.com",
        "correctpassword",
        mockAuth.signInWithEmailAndPassword
      );
      expect(result).to.deep.equal(mockUser);
    });
  });

  describe("logout function", () => {
    it("should call signOut and complete successfully", async () => {
      mockAuth.signOut.resolves();

      await logout(mockAuth, mockAuth.signOut);

      expect(mockAuth.signOut).to.have.been.calledOnce;
    });

    it("should handle errors during logout", async () => {
      const errorMessage = "Logout failed";
      mockAuth.signOut.rejects(new Error(errorMessage));

      try {
        await logout(mockAuth, mockAuth.signOut);
        throw new Error("Expected promise to be rejected, but it was resolved");
      } catch (error) {
        expect(error.message).to.equal(errorMessage);
      }
    });
  });

  describe("register function", () => {
    it("should handle registration errors correctly", async () => {
      const errorMessage = "Registration failed";
      mockAuth.createUserWithEmailAndPassword.rejects(new Error(errorMessage));

      try {
        await register(
          mockAuth,
          "test@example.com",
          "password123",
          mockAuth.createUserWithEmailAndPassword
        );
        throw new Error("Expected promise to be rejected, but it was resolved");
      } catch (error) {
        expect(error.message).to.equal(errorMessage);
      }
    });

    it("should return user on successful registration", async () => {
      const mockUser = { uid: "12345", email: "test@example.com" };
      mockAuth.createUserWithEmailAndPassword.resolves({ user: mockUser });

      const result = await register(
        mockAuth,
        "test@example.com",
        "password123",
        mockAuth.createUserWithEmailAndPassword
      );
      expect(result).to.deep.equal(mockUser);
    });
  });

  describe("loginWithGoogle function", () => {
    it("should handle Google login errors correctly", async () => {
      const errorMessage = "Google login failed";
      mockAuth.signInWithPopup.rejects(new Error(errorMessage));

      try {
        await loginWithGoogle(mockAuth, mockAuth.signInWithPopup);
        throw new Error("Expected promise to be rejected, but it was resolved");
      } catch (error) {
        expect(error.message).to.equal(errorMessage);
      }
    });

    it("should return user on successful Google login", async () => {
      const mockUser = { uid: "12345", email: "test@example.com" };
      mockAuth.signInWithPopup.resolves({ user: mockUser });

      const result = await loginWithGoogle(mockAuth, mockAuth.signInWithPopup);
      expect(result).to.deep.equal(mockUser);
    });
  });
});
