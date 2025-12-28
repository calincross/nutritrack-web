import { Router } from 'express';
import { v4 as uuidv4 } from 'crypto';
import { db } from '@/db';
import { meals } from '@/db/schema';
import { eq, and, gte, lte } from 'drizzle-orm';
import { authMiddleware, type AuthRequest } from '@/middleware/auth';

const router = Router();

// Get all meals for user
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { date, startDate, endDate } = req.query;

    let query = db.query.meals.findMany({
      where: eq(meals.userId, req.userId!),
    });

    if (date) {
      query = db.query.meals.findMany({
        where: and(eq(meals.userId, req.userId!), eq(meals.date, date as string)),
      });
    } else if (startDate && endDate) {
      query = db.query.meals.findMany({
        where: and(
          eq(meals.userId, req.userId!),
          gte(meals.date, startDate as string),
          lte(meals.date, endDate as string)
        ),
      });
    }

    const userMeals = await query;
    res.json(userMeals);
  } catch (error) {
    console.error('Get meals error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create meal
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { name, category, calories, date, time, notes } = req.body;

    if (!name || !category || !calories || !date || !time) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const mealId = uuidv4();
    await db.insert(meals).values({
      id: mealId,
      userId: req.userId!,
      name,
      category,
      calories,
      date,
      time,
      notes,
    });

    const newMeal = await db.query.meals.findFirst({
      where: eq(meals.id, mealId),
    });

    res.status(201).json(newMeal);
  } catch (error) {
    console.error('Create meal error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update meal
router.put('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { name, category, calories, date, time, notes } = req.body;

    // Check if meal belongs to user
    const meal = await db.query.meals.findFirst({
      where: and(eq(meals.id, id), eq(meals.userId, req.userId!)),
    });

    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    await db
      .update(meals)
      .set({
        name,
        category,
        calories,
        date,
        time,
        notes,
      })
      .where(eq(meals.id, id));

    const updatedMeal = await db.query.meals.findFirst({
      where: eq(meals.id, id),
    });

    res.json(updatedMeal);
  } catch (error) {
    console.error('Update meal error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete meal
router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    // Check if meal belongs to user
    const meal = await db.query.meals.findFirst({
      where: and(eq(meals.id, id), eq(meals.userId, req.userId!)),
    });

    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    await db.delete(meals).where(eq(meals.id, id));

    res.json({ message: 'Meal deleted successfully' });
  } catch (error) {
    console.error('Delete meal error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
