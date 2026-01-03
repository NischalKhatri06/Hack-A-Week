const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    department: { type: String, required: true },
    location: { type: String, required: true },
    vacancies: { type: Number, required: true },
    deadline: { type: Date, required: true },
    salary: { type: String },
    education: { type: String, required: true },
    experience: { type: String },
    requirements: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);