import express from 'express';
const router = express.Router();
import Career from '../models/Careers.js';

// GET all careers
router.get('/', async (req, res) => {
    try {
        const careers = await Career.find().sort({ createdAt: -1 });
        res.json(careers);
    } catch (err) {
        console.error('Error fetching careers:', err);
        res.status(500).json({ error: err.message });
    }
});

// POST new career
router.post('/', async (req, res) => {
    try {
        const career = new Career(req.body);
        const savedCareer = await career.save();
        res.status(201).json(savedCareer);
    } catch (err) {
        console.error('Error creating career:', err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE career by ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Career.findByIdAndDelete(id);
        
        if (!result) {
            return res.status(404).json({ error: 'Career not found' });
        }
        
        res.json({ message: 'Career deleted successfully', deletedCount: 1 });
    } catch (err) {
        console.error('Error deleting career:', err);
        res.status(500).json({ error: err.message });
    }
});

export default router;