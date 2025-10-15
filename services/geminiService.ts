
import { GoogleGenAI } from "@google/genai";

// The API key is expected to be set in the environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const runGemini = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        return `Error: ${error.message}`;
    }
    return "An unknown error occurred while contacting the Gemini API.";
  }
};