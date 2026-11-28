import { GoogleGenAI } from "@google/genai"

const genAI = new GoogleGenAI({ apiKey : process.env.GEMINI_API_KEY || "12345"});  

genAI.models.embedContent

export { genAI }
