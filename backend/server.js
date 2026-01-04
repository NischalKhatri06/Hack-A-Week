import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection using Mongoose
const uri = process.env.MONGO_URI;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB (HackAWeek database)"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Import routes (we'll update these next)
import authRoutes from './routes/auth.routes.js';
import jobsRoutes from './routes/jobs.routes.js';
import careersRoutes from './routes/careers.routes.js';
import complaintsRoutes from './routes/complaints.routes.js';
import documentsRoutes from './routes/documents.routes.js';

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/careers', careersRoutes);
app.use('/api/complaints', complaintsRoutes);
app.use('/api/documents', documentsRoutes);

// System prompt for AI chatbot
const SYSTEM_PROMPT = `You are an AI assistant for a Nepali Government Services website. Your role is to help citizens with:

1. **Government Job Vacancies**: Help users find information about available government jobs, eligibility criteria, application processes, and deadlines.

2. **Career Guidance**: Provide advice on educational paths, required skills, entrance exams (like Lok Sewa Aayog), and preparation strategies for various government career fields.

3. **Document Requirements**: Explain what documents are needed for different government services (passport, citizenship, licenses, permits, etc.).

4. **Complaint Guidance**: Help users understand where and how to submit complaints about government bodies or request immediate help for urgent issues.

When responding:
- Be professional, friendly, and helpful
- Provide accurate information about Nepal government procedures
- Give clear, step-by-step guidance when explaining processes
- If you don't know something, admit it and suggest where they can find accurate information
- Use simple language that's easy to understand
- Be culturally sensitive to Nepali context`;

// AI Chatbot endpoint
app.post("/api/chatbot/ask", async (req, res) => {
    try {
        const { question } = req.body;

        if (!question || question.trim() === "") {
            return res.status(400).json({ 
                error: "Question is required" 
            });
        }

        // Check if API key exists
        if (!process.env.GROQ_API_KEY) {
            return res.status(500).json({ 
                error: "GROQ_API_KEY not configured in .env file" 
            });
        }

        // Make request to Groq API
        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "llama-3.1-8b-instant",
                    messages: [
                        { 
                            role: "system", 
                            content: SYSTEM_PROMPT 
                        },
                        { 
                            role: "user", 
                            content: question 
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 1000
                })
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Groq API Error:", errorData);
            throw new Error(errorData.error?.message || "Failed to get response from AI");
        }

        const data = await response.json();
        const answer = data.choices[0]?.message?.content;

        if (!answer) {
            throw new Error("No answer generated");
        }

        res.json({ answer });

    } catch (err) {
        console.error("Server Error:", err);
        res.status(500).json({ 
            error: err.message || "Internal server error" 
        });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'Nepal Gov Portal API is running!',
        timestamp: new Date().toISOString()
    });
});

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'Nepal Gov Portal API is running!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🤖 AI Chatbot endpoint: http://localhost:${PORT}/api/chatbot/ask`);
});