import { getAuth, signInWithCustomToken } from "firebase/auth";

export const loginWithCustomToken = async (customToken: any) => {
  const auth = getAuth();

  try {
    const userCredential = await signInWithCustomToken(auth, customToken);
    const user = userCredential.user;

    const idToken = await user.getIdToken();

    return idToken;
  } catch (error) {
    console.error("Error signing in with custom token:", error);
    throw error;
  }
};