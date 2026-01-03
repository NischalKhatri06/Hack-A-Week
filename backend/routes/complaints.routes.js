const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');

// GET all complaints
router.get('/', async (req, res) => {
    try {
        const complaints = await Complaint.find().sort({ createdAt: -1 });
        res.json(complaints);
    } catch (err) {
        console.error('Error fetching complaints:', err);
        res.status(500).json({ error: err.message });
    }
});

// POST new complaint
router.post('/', async (req, res) => {
    try {
        const complaint = new Complaint(req.body);
        const savedComplaint = await complaint.save();
        res.status(201).json(savedComplaint);
    } catch (err) {
        console.error('Error creating complaint:', err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE complaint by ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Complaint.findByIdAndDelete(id);
        
        if (!result) {
            return res.status(404).json({ error: 'Complaint not found' });
        }
        
        res.json({ message: 'Complaint deleted successfully', deletedCount: 1 });
    } catch (err) {
        console.error('Error deleting complaint:', err);
        res.status(500).json({ error: err.message });
    }
});

// UPDATE complaint status by ID
router.put('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const updatedComplaint = await Complaint.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );
        
        if (!updatedComplaint) {
            return res.status(404).json({ error: 'Complaint not found' });
        }
        
        res.json(updatedComplaint);
    } catch (err) {
        console.error('Error updating complaint:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;