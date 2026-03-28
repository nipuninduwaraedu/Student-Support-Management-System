import express from 'express';
import { body, validationResult } from 'express-validator';
import Claim from '../models/Claim.js';
import Item from '../models/Item.js';
import { auth, adminAuth } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Submit a claim (Student) - handles proof file upload
router.post(
  '/', 
  auth, 
  upload.single('proofFile'),
  [
    body('itemId').notEmpty().withMessage('Item ID is required').isMongoId().withMessage('Invalid Item ID format'),
    body('studentName').notEmpty().withMessage('Student Name is required').trim(),
    body('contactDetails').notEmpty().withMessage('Contact details are required').trim(),
    body('proof').optional().trim()
  ],
  async (req, res) => {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { itemId, studentName, contactDetails, proof } = req.body;
      
      // Determine proof String (file path or text desc)
      let finalProof = proof || '';
      if (req.file) {
        finalProof = `[File Proof]: /uploads/${req.file.filename} - ${proof || ''}`;
      } else if (!proof) {
        return res.status(400).json({ message: 'You must provide proof of ownership either via file upload or text description.' });
      }

      // Check if item exists and is available
      const item = await Item.findById(itemId);
      if (!item || item.status !== 'Available') {
        return res.status(400).json({ message: 'Item is not available for claiming' });
      }

      const claim = new Claim({
        item: itemId,
        student: req.user.id,
        studentName,
        contactDetails,
        proof: finalProof
      });

      await claim.save();
      res.status(201).json(claim);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
});

// Get claims for the logged-in student
router.get('/my-claims', auth, async (req, res) => {
  try {
    const claims = await Claim.find({ student: req.user.id }).populate('item').sort({ createdAt: -1 });
    res.json(claims);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all claims (Admin)
router.get('/', adminAuth, async (req, res) => {
  try {
    const claims = await Claim.find().populate('item student').sort({ createdAt: -1 });
    res.json(claims);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve/Reject a claim (Admin)
router.put('/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body; // 'Approved' or 'Rejected'
    const claim = await Claim.findById(req.params.id);
    
    if (!claim) return res.status(404).json({ message: 'Claim not found' });
    
    claim.status = status;
    await claim.save();

    if (status === 'Approved') {
      // Mark item as claimed
      await Item.findByIdAndUpdate(claim.item, { status: 'Claimed' });
      // Reject all other pending claims for this item
      await Claim.updateMany(
        { item: claim.item, _id: { $ne: claim._id }, status: 'Pending' },
        { status: 'Rejected' }
      );
    } 

    res.json(claim);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a claim (Student)
router.put('/:id', auth, upload.single('proofFile'), async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);
    if (!claim) return res.status(404).json({ message: 'Claim not found' });
    if (claim.student.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });
    if (claim.status !== 'Pending') return res.status(400).json({ message: 'Cannot edit a reviewed claim' });

    if (req.body.studentName) claim.studentName = req.body.studentName;
    if (req.body.contactDetails) claim.contactDetails = req.body.contactDetails;
    
    if (req.file) {
      claim.proof = `[File Proof]: /uploads/${req.file.filename} - ${req.body.proof || ''}`;
    } else if (req.body.proof) {
      // If proof text is provided without a new file, we can preserve the old file link or just overwrite
      if (claim.proof.includes('[File Proof]:')) {
        const oldFile = claim.proof.split(' - ')[0];
        claim.proof = `${oldFile} - ${req.body.proof}`;
      } else {
        claim.proof = req.body.proof;
      }
    }

    await claim.save();
    res.json(claim);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a claim (Student)
router.delete('/:id', auth, async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);
    if (!claim) return res.status(404).json({ message: 'Claim not found' });
    if (claim.student.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });
    if (claim.status !== 'Pending') return res.status(400).json({ message: 'Cannot delete a reviewed claim' });

    await Claim.findByIdAndDelete(req.params.id);
    res.json({ message: 'Claim deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
