import express from "express";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import fs from "fs";

dotenv.config();

const app = express();
app.use(cors());

const upload = multer({ dest: "uploads/" });
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/transcribir", upload.single("audio"), async (req, res) => {
  try {
    const audioPath = req.file.path;

    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioPath),
      model: "whisper-1",
      language: "es"
    });

    fs.unlinkSync(audioPath);

    res.json({ texto: transcription.text });
  } catch (error) {
    res.status(500).json({ error: "Error al transcribir el audio" });
  }
});

app.listen(3000, () => {
  console.log("Servidor listo");
});
