import express from 'express';
const router = express.Router();
import SearchHistory from '../models/SearchHistory.js';

// GET user's search history (limited to last 10 searches)
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const searchType = req.query.type || 'jobs';
        
        const history = await SearchHistory.find({ 
            userId, 
            searchType 
        })
        .sort({ searchDate: -1 })
        .limit(10)
        .select('searchTerm searchDate');
        
        res.json(history);
    } catch (err) {
        console.error('Error fetching search history:', err);
        res.status(500).json({ error: err.message });
    }
});

// POST - Save a new search
router.post('/', async (req, res) => {
    try {
        const { userId, searchTerm, searchType } = req.body;
        
        if (!userId || !searchTerm) {
            return res.status(400).json({ error: 'userId and searchTerm are required' });
        }
        
        // Check if this exact search already exists recently (last 24 hours)
        const existingSearch = await SearchHistory.findOne({
            userId,
            searchTerm: searchTerm.toLowerCase(),
            searchType,
            searchDate: { $gte: new Date(Date.now() - 24*60*60*1000) }
        });
        
        if (existingSearch) {
            // Update the date instead of creating duplicate
            existingSearch.searchDate = new Date();
            await existingSearch.save();
            return res.json(existingSearch);
        }
        
        // Create new search history entry
        const searchHistory = new SearchHistory({
            userId,
            searchTerm: searchTerm.toLowerCase(),
            searchType: searchType || 'jobs'
        });
        
        await searchHistory.save();
        res.status(201).json(searchHistory);
    } catch (err) {
        console.error('Error saving search history:', err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE - Clear user's search history
router.delete('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const searchType = req.query.type || 'jobs';
        
        await SearchHistory.deleteMany({ userId, searchType });
        res.json({ message: 'Search history cleared' });
    } catch (err) {
        console.error('Error clearing search history:', err);
        res.status(500).json({ error: err.message });
    }
});

export default router;