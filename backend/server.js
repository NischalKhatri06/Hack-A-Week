const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection using Mongoose - connects to HackAWeek database
const uri = process.env.MONGO_URI;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB (HackAWeek database)"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/jobs', require('./routes/jobs.routes'));
app.use('/api/careers', require('./routes/careers.routes'));
app.use('/api/complaints', require('./routes/complaints.routes'));
app.use('/api/documents', require('./routes/documents.routes'));

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'Nepal Gov Portal API is running!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});