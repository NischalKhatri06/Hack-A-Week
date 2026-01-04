import fetch from "node-fetch";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// ES modules fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// System prompt for government services context
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

// Route to handle AI questions
app.post("/ask", async (req, res) => {
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

        // Extract answer from response
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

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({ 
        status: "Server is running",
        timestamp: new Date().toISOString()
    });
});

// Serve index.html for root path
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
    console.log(`🤖 AI endpoint: http://localhost:${PORT}/ask`);
    console.log(`📁 Serving static files from: ${path.join(__dirname, "public")}`);
});