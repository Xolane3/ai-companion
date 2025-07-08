// server/routes/tutor.js
const express = require("express");
const router = express.Router();
const axios = require("axios");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/", upload.array("files"), async (req, res) => {
  const message = req.body.message;

  if (!message || message.trim() === "") {
    return res.status(400).json({ error: "No question provided." });
  }

  // Optional: you can access files with req.files
  const files = req.files || [];

  const isAccounting = /accounting|balance sheet|journal|income statement|ledger|assets|liabilities|equity/i.test(message);

  if (isAccounting) {
    return res.json({
      reply: "📢 Accounting support is coming soon! Please try a Maths question for now.",
    });
  }

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct",
        messages: [
          {
            role: "system",
            content:
              "You are a brilliant Maths tutor. Explain mathematical concepts like straight-line graphs and quadratics step-by-step, as if teaching a student. Use examples when helpful.",
          },
          {
            role: "user",
            content: message,
          },
        ],
        max_tokens: 300,
        temperature: 0.5,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.choices[0].message.content.trim();
    res.json({ reply });
  } catch (error) {
    console.error("🚨 Tutor API Error:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
      console.error("Headers:", error.response.headers);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
    res.status(500).json({ error: "❌ Failed to get tutor response." });
  }
});

module.exports = router;
