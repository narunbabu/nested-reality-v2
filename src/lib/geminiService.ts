import { GoogleGenAI } from "@google/genai";

export async function askConceptAssistant(query: string, conceptContext?: string) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return "AI service is not configured. Please add GEMINI_API_KEY to your environment.";
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: `User Question: ${query}${conceptContext ? `\nContextual Concept: ${conceptContext}` : ''}`,
      config: {
        systemInstruction: `You are an expert AI assistant for the book "Nested Reality" by Arun Nalamara.
      The book posits that reality is defined by density and nesting rather than particles and force.

      Guidelines:
      1. Stay consistent with the "Nested Reality" framework.
      2. Use a calm, intellectual, and helpful tone.
      3. If you don't know an answer specifically from the book, use the principles of continuity and density to reason through it.
      4. Keep explanations clear but serious.`,
      },
    });

    return response.text || "I apologize, but I was unable to generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again in a moment.";
  }
}
