// src/services/firebaseAuthMock.js

import sinon from "sinon";

export const mockAuth = {
  settings: {},
  signInWithEmailAndPassword: sinon.stub(),
  signOut: sinon.stub(),
  createUserWithEmailAndPassword: sinon.stub(),
  signInWithPopup: sinon.stub(),
};

export const resetAuthMocks = () => {
  mockAuth.signInWithEmailAndPassword.reset();
  mockAuth.signOut.reset();
  mockAuth.createUserWithEmailAndPassword.reset();
  mockAuth.signInWithPopup.reset();
};
