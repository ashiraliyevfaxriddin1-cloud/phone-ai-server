const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

app.use(cors());

// JSON ham, oddiy text ham qabul qiladi
app.use(express.json());
app.use(express.text());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get("/", (req, res) => {
  res.send("Phone AI Server ishlayapti");
});

app.post("/chat", async (req, res) => {
  try {
    let message = "";

    if (typeof req.body === "string") {
      message = req.body;
    } else if (req.body && req.body.message) {
      message = req.body.message;
    }

    if (!message || message.trim() === "") {
      return res.json({
        reply: "Savol yuborilmadi."
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash"
    });

    const result = await model.generateContent(`
Sen Telefon Yordamchi AI san.

Har doim faqat o'zbek tilida javob ber.

Telefon nosozliklarini oddiy qilib tushuntir.

Foydalanuvchi savoli:
${message}
`);

    const answer = result.response.text();

    res.json({
      reply: answer
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      reply: "AI serverda xatolik yuz berdi."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server ishga tushdi: " + PORT);
});
