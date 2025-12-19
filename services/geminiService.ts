
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateLessonContent = async (topic: string, grade: string, subject: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Create a detailed lesson plan for the following topic: ${topic}. 
                 The target students are in grade ${grade} for the subject ${subject}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            duration: { type: Type.STRING },
            objectives: { type: Type.STRING },
            standards: { type: Type.STRING },
            materials: { type: Type.ARRAY, items: { type: Type.STRING } },
            procedure: {
              type: Type.OBJECT,
              properties: {
                anticipatorySet: { type: Type.STRING },
                directInstruction: { type: Type.STRING },
                guidedPractice: { type: Type.STRING },
                independentPractice: { type: Type.STRING },
                closure: { type: Type.STRING }
              },
              required: ["anticipatorySet", "directInstruction", "guidedPractice", "independentPractice", "closure"]
            },
            assessment: { type: Type.STRING },
            differentiation: { type: Type.STRING }
          },
          required: ["title", "duration", "objectives", "standards", "materials", "procedure", "assessment", "differentiation"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};
