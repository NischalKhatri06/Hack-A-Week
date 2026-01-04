import express from 'express';
const router = express.Router();
import Job from '../models/Job.js';

// GET all jobs
router.get('/', async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        console.error('Error fetching jobs:', err);
        res.status(500).json({ error: err.message });
    }
});

// POST new job
router.post('/', async (req, res) => {
    try {
        const job = new Job(req.body);
        const savedJob = await job.save();
        res.status(201).json(savedJob);
    } catch (err) {
        console.error('Error creating job:', err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE job by ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Job.findByIdAndDelete(id);
        
        if (!result) {
            return res.status(404).json({ error: 'Job not found' });
        }
        
        res.json({ message: 'Job deleted successfully', deletedCount: 1 });
    } catch (err) {
        console.error('Error deleting job:', err);
        res.status(500).json({ error: err.message });
    }
});

export default router;