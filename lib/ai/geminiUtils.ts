import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API || "YOUR_API_KEY");  
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001"});

export { model , embeddingModel}
