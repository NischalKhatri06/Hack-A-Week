import express from 'express';
const router = express.Router();
import Complaint from '../models/Complaint.js';

// Mock authentication middleware (replace with real auth in production)
function mockAuth(req, res, next) {
    req.user = { id: '64f000000000000000000001' }; // Matches CURRENT_USER_ID in frontend
    next();
}

router.use(mockAuth);

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

// POST new complaint — userId set securely from authenticated user
router.post('/', async (req, res) => {
    try {
        const { name, phone, email, department, priority, subject, description, location } = req.body;

        const complaint = new Complaint({
            name,
            phone,
            email,
            department,
            priority,
            subject,
            description,
            location,
            userId: req.user.id  // Secure: never trust frontend
        });

        const savedComplaint = await complaint.save();
        res.status(201).json(savedComplaint);
    } catch (err) {
        console.error('Error creating complaint:', err);
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ error: 'Complaint not found' });
        }

        // Ensure type is string for comparison
        if (complaint.userId.toString() !== req.user.id.toString()) {
            return res.status(403).json({ error: 'This is not your complaint and you cannot delete it' });
        }

        await complaint.deleteOne();
        res.json({ message: 'Complaint deleted successfully' });
    } catch (err) {
        console.error('Error deleting complaint:', err);
        res.status(500).json({ error: err.message });
    }
});



// UPDATE status
router.put('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['pending', 'in-progress', 'resolved'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }

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
        console.error('Error updating complaint status:', err);
        res.status(500).json({ error: err.message });
    }
});

export default router;