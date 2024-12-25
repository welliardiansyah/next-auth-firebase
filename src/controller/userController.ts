import { Request, Response } from 'express';
import { db } from '../config/firebaseConfig';
import * as admin from 'firebase-admin';
import { handlerResponse } from '../helper/responseHandler';
import { hashPassword, verifyPassword } from '../util/passwordVerify';
import { loginWithCustomToken } from '../helper/customeToken'
import { token } from 'morgan';

export const createUser = async (req: Request, res: Response) => {
  const { email, password, displayName } = req.body;
  if (!email || !password || !displayName) {
    return handlerResponse(res, {
      statusCode: 400,
      message: 'Validation error',
      error: 'Email, password, and displayName are required',
    });
  }

  try {
    try {
      await admin.auth().getUserByEmail(email);
      return handlerResponse(res, {
        statusCode: 400,
        message: 'Email is already in use by another account',
      });
    } catch (getUserError: any) {
      if (getUserError.code !== 'auth/user-not-found') {
        throw getUserError;
      }
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await admin.auth().createUser({
      email,
      password,
      displayName,
    });

    const userData = {
      uid: newUser.uid,
      email: newUser.email,
      displayName: newUser.displayName,
      password: hashedPassword,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection('users').doc(newUser.uid).set(userData);
    const token = await admin.auth().createCustomToken(newUser.uid);

    return handlerResponse(res, {
      statusCode: 201,
      message: 'User created successfully',
      data: {
        uid: newUser.uid,
        email: newUser.email,
        displayName: newUser.displayName,
        token: token,
      },
    });
  } catch (error: any) {
    return handlerResponse(res, {
      statusCode: 500,
      message: 'Error creating user',
      error: error.message || error,
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return handlerResponse(res, {
      statusCode: 400,
      message: 'Validation error',
      error: 'Email and password are required',
    });
  }

  try {
    const userDoc = await db.collection('users').where('email', '==', email).get();

    if (userDoc.empty) {
      return handlerResponse(res, {
        statusCode: 401,
        message: 'Invalid credentials',
        error: 'Email not found',
      });
    }

    const user = userDoc.docs[0].data();

    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return handlerResponse(res, {
        statusCode: 401,
        message: 'Invalid credentials',
        error: 'Incorrect password',
      });
    }

    const customToken = await admin.auth().createCustomToken(user.uid);

    const idToken = await loginWithCustomToken(customToken);
    return handlerResponse(res, {
      statusCode: 200,
      message: 'User logged in successfully',
      data: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        token: idToken,
      },
    });
  } catch (error: any) {
    return handlerResponse(res, {
      statusCode: 500,
      message: 'Login failed',
      error: error.message || error,
    });
  }
};
