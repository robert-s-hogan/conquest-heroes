// firebaseConfig.cy.js
import { initializeApp } from "firebase/app";
import firebaseConfig from "@/firebase/firebaseConfig";

describe("Firebase Configuration", () => {
  it("should initialize Firebase app without errors", () => {
    const app = initializeApp(firebaseConfig);
    expect(app).to.exist;
  });
});
