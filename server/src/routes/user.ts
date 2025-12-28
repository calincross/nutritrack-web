import { Router } from 'express';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { authMiddleware, type AuthRequest } from '@/middleware/auth';

const router = Router();

// Update profile
router.put('/profile', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { dailyCalorieGoal, dietType } = req.body;

    await db
      .update(users)
      .set({
        dailyCalorieGoal: dailyCalorieGoal || undefined,
        dietType: dietType || undefined,
      })
      .where(eq(users.id, req.userId!));

    const updatedUser = await db.query.users.findFirst({
      where: eq(users.id, req.userId!),
    });

    res.json({
      id: updatedUser?.id,
      email: updatedUser?.email,
      dailyCalorieGoal: updatedUser?.dailyCalorieGoal,
      dietType: updatedUser?.dietType,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update calorie goal
router.put('/calorie-goal', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { dailyCalorieGoal } = req.body;

    if (!dailyCalorieGoal || dailyCalorieGoal < 0) {
      return res.status(400).json({ message: 'Invalid calorie goal' });
    }

    await db
      .update(users)
      .set({ dailyCalorieGoal })
      .where(eq(users.id, req.userId!));

    res.json({ message: 'Calorie goal updated successfully' });
  } catch (error) {
    console.error('Update calorie goal error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update diet type
router.put('/diet-type', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { dietType } = req.body;

    if (!dietType) {
      return res.status(400).json({ message: 'Diet type is required' });
    }

    await db
      .update(users)
      .set({ dietType })
      .where(eq(users.id, req.userId!));

    res.json({ message: 'Diet type updated successfully' });
  } catch (error) {
    console.error('Update diet type error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
