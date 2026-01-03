const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    service: { type: String, required: true },
    office: { type: String, required: true },
    documents: [{ type: String, required: true }],
    info: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);