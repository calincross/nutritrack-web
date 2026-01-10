import { Router } from 'express';
import { randomUUID } from 'crypto';
import { db } from '@/db';
import { documents } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { authMiddleware, type AuthRequest } from '@/middleware/auth';
import upload from '@/middleware/upload';

const router = Router();

function uuidv4() {
  return randomUUID();
}

// Get all documents for user
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { type } = req.query;

    let query = db.query.documents.findMany({
      where: eq(documents.userId, req.userId!),
    });

    if (type) {
      query = db.query.documents.findMany({
        where: and(eq(documents.userId, req.userId!), eq(documents.type, type as string)),
      });
    }

    const userDocuments = await query;
    res.json(userDocuments);
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Upload document
router.post('/upload', authMiddleware, upload.single('file'), async (req: AuthRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    const { type } = req.body;

    if (!type || !['diet-plan', 'consultation'].includes(type)) {
      return res.status(400).json({ message: 'Invalid document type' });
    }

    const docId = uuidv4();
    const fileUrl = `/uploads/${req.file.filename}`;

    await db.insert(documents).values({
      id: docId,
      userId: req.userId!,
      name: req.file.originalname,
      type,
      url: fileUrl,
      size: req.file.size,
    });

    const newDoc = await db.query.documents.findFirst({
      where: eq(documents.id, docId),
    });

    res.status(201).json(newDoc);
  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete document
router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    // Check if document belongs to user
    const doc = await db.query.documents.findFirst({
      where: and(eq(documents.id, id), eq(documents.userId, req.userId!)),
    });

    if (!doc) {
      return res.status(404).json({ message: 'Document not found' });
    }

    await db.delete(documents).where(eq(documents.id, id));

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
