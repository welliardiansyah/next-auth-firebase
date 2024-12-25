import { Router } from 'express';
import { updateUserData, fetchUserData } from '../controller/api';
import { authMiddleware } from '../middleware/authMiddleware';
import { createUser, loginUser } from '../controller/userController';

const router = Router();

router.put('/updateUser', authMiddleware, async (req, res, next) => {
  try {
    await updateUserData(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/fetchUser/:id', authMiddleware, async (req, res, next) => {
  try {
    await fetchUserData(req, res);
  } catch (error) {
    next(error);
  }
});

router.post('/createUser', authMiddleware, async (req, res, next) => {
    try {
      await createUser(req, res);
    } catch (error) {
      next(error);
    }
  });

router.post('/login', async (req, res, next) => {
  try {
    await loginUser(req, res);
  } catch (error) {
    next(error);
  }
});


export default router;
