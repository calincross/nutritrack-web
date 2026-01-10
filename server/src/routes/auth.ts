import { Router } from 'express';
import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { authMiddleware, type AuthRequest } from '@/middleware/auth';
import { sendWelcomeEmail } from '@/services/email';

const router = Router();

function uuidv4() {
  return randomUUID();
}

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userId = uuidv4();
    await db.insert(users).values({
      id: userId,
      email,
      password: hashedPassword,
    });

    // Send welcome email
    const userName = email.split('@')[0];
    sendWelcomeEmail(email, userName).catch(err => console.error('Email error:', err));

    // Generate token
    const token = jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: '7d',
    });

    res.status(201).json({
      token,
      user: {
        id: userId,
        email,
        dailyCalorieGoal: 2000,
        dietType: 'balanced',
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: '7d',
    });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        dailyCalorieGoal: user.dailyCalorieGoal,
        dietType: user.dietType,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get profile
router.get('/profile', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, req.userId!),
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      dailyCalorieGoal: user.dailyCalorieGoal,
      dietType: user.dietType,
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Logout
router.post('/logout', authMiddleware, (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

export default router;
