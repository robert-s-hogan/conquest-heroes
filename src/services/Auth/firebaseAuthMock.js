import sinon from "sinon";

export const mockAuth = {
  settings: {},
  signInWithEmailAndPassword: sinon.stub(),
};

export const resetAuthMocks = () => {
  mockAuth.signInWithEmailAndPassword.reset();
};
