import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());

// Serve static assets from Vite's build directory (dist)
app.use(express.static(path.join(__dirname, 'dist')));

// API endpoint for chat
app.post('/api/chat', async (req, res) => {
  try {
    const { query, profile, history, messages } = req.body;

    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      console.warn("GROQ_API_KEY is not defined. Falling back to local template response.");
      return res.status(500).json({
        results: [],
        response: "Groq API key not configured on Render. Please add GROQ_API_KEY to your environment variables.",
        intent: 'general',
        geminiUsed: false,
        geminiError: "Missing GROQ_API_KEY"
      });
    }

    const SYSTEM = `You are JanMitra AI (also known as JanSeva AI), an informational assistant for Indian government schemes and services.
You are NOT an official government representative.
NEVER ask for Aadhaar, PAN, passport, bank account, OTP, passwords, or personal documents.
Always tell users to apply only through official government portals like myscheme.gov.in, uidai.gov.in, pmkisan.gov.in, etc.
If you are unsure, say: "I could not verify this. Please check the official government website."
Give simple, step-by-step guidance in easy language.`;

    // Construct messages payload for Groq
    let formattedMessages = [];
    if (messages && Array.isArray(messages)) {
      formattedMessages = messages;
    } else {
      if (history && Array.isArray(history)) {
        formattedMessages.push(...history.map(h => ({
          role: h.role === 'user' ? 'user' : 'assistant',
          content: h.content
        })));
      }
      if (query) {
        let userContent = query;
        if (profile) {
          userContent += `\n\nUser Profile: Age ${profile.age || 'N/A'}, Gender ${profile.gender || 'N/A'}, State ${profile.state || 'N/A'}, Occupation ${profile.occupation || 'N/A'}, Annual Income ${profile.annual_income || 'N/A'}, Caste ${profile.caste || 'N/A'}, Disability ${profile.disability ? 'Yes' : 'No'}, Education ${profile.education || 'N/A'}`;
        }
        formattedMessages.push({ role: 'user', content: userContent });
      }
    }

    // Call Groq API
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "system", content: SYSTEM }, ...formattedMessages],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Groq API returned ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Please check the official government website.";

    res.json({
      results: [],
      response: reply,
      intent: 'general',
      geminiUsed: true,
      geminiError: null
    });
  } catch (err) {
    console.error("Chat API error:", err);
    res.status(500).json({
      results: [],
      response: "I couldn't connect to the AI service. Please check the official government website.",
      intent: 'general',
      geminiUsed: false,
      geminiError: err instanceof Error ? err.message : String(err)
    });
  }
});

// All other requests serve index.html for clientside routing (or Vite SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
