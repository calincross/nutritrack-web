import { Router } from 'express';
import { randomUUID } from 'crypto';
import { db } from '@/db';
import { recipes } from '@/db/schema';
import { eq, and, like } from 'drizzle-orm';
import { authMiddleware, type AuthRequest } from '@/middleware/auth';

const router = Router();

function uuidv4() {
  return randomUUID();
}

// Get all recipes for user
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userRecipes = await db.query.recipes.findMany({
      where: eq(recipes.userId, req.userId!),
    });
    res.json(userRecipes);
  } catch (error) {
    console.error('Get recipes error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Search recipes
router.get('/search', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const userRecipes = await db.query.recipes.findMany({
      where: and(
        eq(recipes.userId, req.userId!),
        like(recipes.name, `%${q}%`)
      ),
    });

    res.json(userRecipes);
  } catch (error) {
    console.error('Search recipes error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create recipe
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { name, ingredients, instructions, caloriesPerServing } = req.body;

    if (!name || !ingredients || !instructions || !caloriesPerServing) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const recipeId = uuidv4();
    await db.insert(recipes).values({
      id: recipeId,
      userId: req.userId!,
      name,
      ingredients: JSON.stringify(ingredients),
      instructions,
      caloriesPerServing,
    });

    const newRecipe = await db.query.recipes.findFirst({
      where: eq(recipes.id, recipeId),
    });

    res.status(201).json(newRecipe);
  } catch (error) {
    console.error('Create recipe error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update recipe
router.put('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { name, ingredients, instructions, caloriesPerServing } = req.body;

    // Check if recipe belongs to user
    const recipe = await db.query.recipes.findFirst({
      where: and(eq(recipes.id, id), eq(recipes.userId, req.userId!)),
    });

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    await db
      .update(recipes)
      .set({
        name,
        ingredients: JSON.stringify(ingredients),
        instructions,
        caloriesPerServing,
      })
      .where(eq(recipes.id, id));

    const updatedRecipe = await db.query.recipes.findFirst({
      where: eq(recipes.id, id),
    });

    res.json(updatedRecipe);
  } catch (error) {
    console.error('Update recipe error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete recipe
router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    // Check if recipe belongs to user
    const recipe = await db.query.recipes.findFirst({
      where: and(eq(recipes.id, id), eq(recipes.userId, req.userId!)),
    });

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    await db.delete(recipes).where(eq(recipes.id, id));

    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Delete recipe error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
