import { login } from "./authServices";
import sinon from "sinon";

describe("Auth Service - login function", () => {
  let signInStub;

  beforeEach(() => {
    // Stub the signInWithEmailAndPassword function
    signInStub = sinon.stub();
  });

  it("should handle login errors correctly", async () => {
    const errorMessage = "Login failed";
    signInStub.rejects(new Error(errorMessage)); // Mock the rejection

    try {
      await login({}, "test@example.com", "wrongpassword", signInStub);
      throw new Error("Expected promise to be rejected, but it was resolved");
    } catch (error) {
      expect(error.message).to.equal(errorMessage); // Assert that error is as expected
    }
  });

  it("should return user on successful login", async () => {
    const mockUser = { uid: "12345", email: "test@example.com" };
    signInStub.resolves({ user: mockUser }); // Mock a successful login

    const result = await login(
      {},
      "test@example.com",
      "correctpassword",
      signInStub
    );
    expect(result).to.equal(mockUser); // Assert that the returned user matches the mock user
  });
});
