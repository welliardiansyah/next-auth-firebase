import { db } from '../config/firebaseConfig';
import { User } from '../entities/user';
import { hashPassword } from '../util/passwordVerify';

export const updateUser = async (user: User): Promise<void> => {
  try {
    const hashedPassword = await hashPassword(user.password);
    
    await db.collection('users').doc(user.uid).set({
      name: user.displayName,
      email: user.email,
      password: hashedPassword,
    }, { merge: true });
  } catch (error) {
    throw new Error('Failed to update user data: ' + error);
  }
};

export const fetchUserById = async (userId: string): Promise<User | null> => {
  try {
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return null;
    }

    return userDoc.data() as User;
  } catch (error) {
    throw new Error('Failed to fetch user data: ' + error);
  }
};
