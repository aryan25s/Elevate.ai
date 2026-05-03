import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();
const client = new GoogleGenAI({
  apiKey: process.env.Gemini_API_kEY,
});

async function test() {
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Explain AI in simple terms.",
    })
    console.log("Response:", response.text);
} 
test();