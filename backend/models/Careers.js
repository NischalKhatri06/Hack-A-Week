const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema({
    position: { type: String, required: true },
    department: { type: String, required: true },
    education: { type: String, required: true },
    skills: { type: String, required: true },
    pathway: { type: String, required: true },
    exams: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Career', careerSchema);