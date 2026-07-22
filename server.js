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
    const message = req.body.message;

    if (!message) {
      return res.json({
        reply: "Savol yozilmadi"
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash"
    });

    const prompt = `
Sen Telefon Yordamchi AI san.

Vazifang:
- Telefon nosozliklarini tushuntirish.
- O'zbek tilida javob berish.
- Oddiy va tushunarli yozish.
- Kerak bo'lsa bosqichma-bosqich ko'rsatma berish.

Foydalanuvchi savoli:
${message}
`;

    const result = await model.generateContent(prompt);

    const answer = result.response.text();

    res.json({
      reply: answer
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      reply: "AI serverda xatolik yuz berdi"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server ishga tushdi: " + PORT);
});
