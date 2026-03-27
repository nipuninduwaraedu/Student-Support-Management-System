import express from 'express';
import { body, validationResult } from 'express-validator';
import Item from '../models/Item.js';
import { auth, adminAuth } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Get all available items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find({ status: 'Available' }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all items (Admin)
router.get('/all', adminAuth, async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single item
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create item (Admin only) - now handles image file upload
router.post(
  '/', 
  adminAuth, 
  upload.single('imageFile'),
  [
    body('name').notEmpty().withMessage('Item name is required').trim(),
    body('description').notEmpty().withMessage('Description is required').trim(),
    body('location').notEmpty().withMessage('Location is required').trim(),
    body('date').isISO8601().toDate().withMessage('A valid date must be provided')
  ],
  async (req, res) => {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // If a file was uploaded, use its URL/path, otherwise fallback to standard text URL if provided
      let imagePath = req.body.image || '';
      if (req.file) {
        imagePath = `/uploads/${req.file.filename}`;
      }

      const itemData = {
        name: req.body.name,
        description: req.body.description,
        location: req.body.location,
        date: req.body.date,
        image: imagePath
      };

      const item = new Item(itemData);
      await item.save();
      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update item (Admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete item (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
