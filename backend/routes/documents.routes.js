const express = require('express');
const router = express.Router();
const Document = require('../models/Document');

// GET all documents
router.get('/', async (req, res) => {
    try {
        const documents = await Document.find().sort({ createdAt: -1 });
        res.json(documents);
    } catch (err) {
        console.error('Error fetching documents:', err);
        res.status(500).json({ error: err.message });
    }
});

// POST new document
router.post('/', async (req, res) => {
    try {
        const document = new Document(req.body);
        const savedDocument = await document.save();
        res.status(201).json(savedDocument);
    } catch (err) {
        console.error('Error creating document:', err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE document by ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Document.findByIdAndDelete(id);
        
        if (!result) {
            return res.status(404).json({ error: 'Document not found' });
        }
        
        res.json({ message: 'Document deleted successfully', deletedCount: 1 });
    } catch (err) {
        console.error('Error deleting document:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;