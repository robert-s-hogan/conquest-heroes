import { login, logout, register, loginWithGoogle } from './authServices'
import sinon from 'sinon'

describe('Auth Service', () => {
  let mockAuth

  beforeEach(() => {
    // Re-create the mock object before each test
    mockAuth = {
      signInWithEmailAndPassword: sinon.stub(),
      signOut: sinon.stub(),
      createUserWithEmailAndPassword: sinon.stub(),
      signInWithPopup: sinon.stub(),
    }
  })

  describe('login function', () => {
    it('should handle login errors correctly', async () => {
      const errorMessage = 'Login failed'
      mockAuth.signInWithEmailAndPassword.rejects(new Error(errorMessage))

      try {
        await login(
          mockAuth,
          'test@example.com',
          'wrongpassword',
          mockAuth.signInWithEmailAndPassword
        )
        throw new Error('Expected promise to be rejected, but it was resolved')
      } catch (error) {
        expect(error.message).to.equal(errorMessage)
      }
    })

    it('should return user on successful login', async () => {
      const mockUser = { uid: '12345', email: 'test@example.com' }
      mockAuth.signInWithEmailAndPassword.resolves({ user: mockUser })

      const result = await login(
        mockAuth,
        'test@example.com',
        'correctpassword',
        mockAuth.signInWithEmailAndPassword
      )
      expect(result).to.deep.equal(mockUser)
    })
  })

  describe('logout function', () => {
    it('should call signOut and complete successfully', async () => {
      mockAuth.signOut.resolves()

      await logout(mockAuth, mockAuth.signOut)

      expect(mockAuth.signOut).to.have.been.calledOnce
    })

    it('should handle errors during logout', async () => {
      const errorMessage = 'Logout failed'
      mockAuth.signOut.rejects(new Error(errorMessage))

      try {
        await logout(mockAuth, mockAuth.signOut)
        throw new Error('Expected promise to be rejected, but it was resolved')
      } catch (error) {
        expect(error.message).to.equal(errorMessage)
      }
    })
  })

  describe('register function', () => {
    it('should handle registration errors correctly', async () => {
      mockAuth.createUserWithEmailAndPassword.rejects({
        code: 'auth/email-already-in-use',
        message: 'The email address is already in use.',
      })

      try {
        await register(mockAuth, 'existing-email@example.com', 'password123')
        throw new Error('Expected registration to fail')
      } catch (error) {
        expect(error.message).to.equal(
          'This email is already registered. Please use another email or login.'
        )
      }
    })

    it('should return user on successful registration', async () => {
      const mockUserCredential = { user: { email: 'new-user@example.com' } }
      mockAuth.createUserWithEmailAndPassword.resolves(mockUserCredential)

      const userCredential = await register(
        mockAuth,
        'new-user@example.com',
        'password123'
      )
      expect(userCredential).to.equal(mockUserCredential)
    })
  })

  describe('loginWithGoogle function', () => {
    it('should handle Google login errors correctly', async () => {
      const errorMessage = 'Google login failed'
      mockAuth.signInWithPopup.rejects(new Error(errorMessage))

      try {
        await loginWithGoogle(mockAuth, mockAuth.signInWithPopup)
        throw new Error('Expected promise to be rejected, but it was resolved')
      } catch (error) {
        expect(error.message).to.equal(errorMessage)
      }
    })

    it('should return user on successful Google login', async () => {
      const mockUser = { uid: '12345', email: 'test@example.com' }
      mockAuth.signInWithPopup.resolves({ user: mockUser })

      const result = await loginWithGoogle(mockAuth, mockAuth.signInWithPopup)
      expect(result).to.deep.equal(mockUser)
    })
  })
})
