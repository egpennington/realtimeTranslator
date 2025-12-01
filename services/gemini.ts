import { GoogleGenAI } from "@google/genai";
import { TargetLanguage } from "../types";

// Ensure API key is present
// const apiKey = process.env.API_KEY || '';
const apiKey = import.meta.env.API_KEY;

if (!apiKey) {
  throw new Error("VITE_API_KEY is missing from environment variables.");
}

const ai = new GoogleGenAI({ apiKey });

export const translateText = async (
  text: string,
  targetLanguage: TargetLanguage
): Promise<string> => {
  if (!text.trim()) return "";
  if (!apiKey) throw new Error("API Key is missing.");

  try {
    const prompt = `Translate the following English text to natural, conversational ${targetLanguage}.
    
    English: "${text}"
    
    Target (${targetLanguage}):`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        // Lower temperature for more accurate translation, though some creativity helps naturalness
        temperature: 0.3, 
        systemInstruction: "You are an expert translator. Output ONLY the translated text without quotes, explanations, or romanization.",
      }
    });

    return response.text ? response.text.trim() : "";
  } catch (error) {
    console.error("Translation error:", error);
    throw new Error("Failed to translate text. Please try again.");
  }
};