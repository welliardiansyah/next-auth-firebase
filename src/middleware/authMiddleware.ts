import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';

declare global {
  namespace Express {
    interface Request {
      userUid?: string;
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.headers['authorization'];
  if (!token) {
    console.error("Authorization token not provided");
    res.status(401).json({ error: 'Authorization token is required' });
    return;
  }

  try {
    const idToken = token.split(' ')[1];
    if (!idToken) {
      console.error("Invalid token format");
      res.status(401).json({ error: 'Invalid token format' });
      return;
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log("Token verified successfully:", decodedToken.email);
    req.userUid = decodedToken.uid;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
