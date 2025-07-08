const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/", async (req, res) => {
  const { text } = req.body;

  if (!text || text.trim() === "") {
    return res.status(400).json({ error: "No text provided." });
  }

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct", // ✅ Correct model ID
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that summarizes academic notes clearly and concisely.",
          },
          {
            role: "user",
            content: `Summarize the following notes:\n\n${text}`,
          },
        ],
        max_tokens: 200,
        temperature: 0.5,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173", // Optional but good practice for local dev
        },
      }
    );

    const summary = response.data.choices[0].message.content.trim();
    res.json({ summary });
  } catch (error) {
    console.error("Mistral API error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate summary." });
  }
});

module.exports = router;
