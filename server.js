const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get("/", (req, res) => {
  res.send("Phone AI Server ishlayapti");
});

app.post("/chat", async (req, res) => {
  try {
    let message = "";

    if (typeof req.body === "string") {
      try {
        const data = JSON.parse(req.body);
        message = data.message;
      } catch {
        message = req.body;
      }
    } else {
      message = req.body.message;
    }

    if (!message) {
      return res.json({
        reply: "Savol yuborilmadi."
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash"
    });

    const result = await model.generateContent(
      `Sen Telefon Yordamchi AI san.
Har doim o'zbek tilida javob ber.
Telefon muammolarini oddiy qilib tushuntir.

Savol:
${message}`
    );

    const answer = result.response.text();

    res.json({
      reply: answer
    });

  } catch (e) {
    console.log(e);

    res.status(500).json({
      reply: "Server xatosi yuz berdi."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server ishga tushdi: " + PORT);
});
