import { Request, Response } from 'express';
import { updateUser, fetchUserById } from '../repository/userCollection';
import { User } from '../entities/user';
import { handlerResponse } from '../helper/responseHandler';

export const updateUserData = async (req: Request, res: Response): Promise<void> => {
  const user: User = req.body;
  if (!user || !user.uid) {
    return handlerResponse(res, { statusCode: 400, message: 'Invalid user data or missing user ID' });
  }

  try {
    const existingUser = await fetchUserById(user.uid);
    if (!existingUser) {
      return handlerResponse(res, { statusCode: 404, message: 'User not found' });
    }

    await updateUser(user);
    handlerResponse(res, { statusCode: 200, message: 'User data updated successfully', data: user });
  } catch (error) {
    handlerResponse(res, { statusCode: 500, message: 'Failed to update user data', error: error });
  }
};

export const fetchUserData = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  if (!id) {
    return handlerResponse(res, { statusCode: 400, message: 'User ID is required' });
  }

  try {
    const user = await fetchUserById(id);
    if (!user) {
      return handlerResponse(res, { statusCode: 404, message: 'User not found' });
    }
    const { password, ...userWithoutPassword } = user;

    handlerResponse(res, { statusCode: 200, message: 'Get data users successfully!.', data: userWithoutPassword });
  } catch (error) {
    handlerResponse(res, { statusCode: 500, message: 'Failed to fetch user data', error: error });
  }
};