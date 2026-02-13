
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { SentimentResult } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateBrandNames = async (industry: string, values: string[], audience: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate 5 creative brand names for a company in the ${industry} industry. 
    Core values: ${values.join(', ')}. Target audience: ${audience}.
    Return a JSON array of strings.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });
  return JSON.parse(response.text || '[]');
};

export const generateLogo = async (brandName: string, industry: string, style: string) => {
  const ai = getAI();
  const prompt = `A professional minimalist logo for a brand named "${brandName}" in the ${industry} industry. Style: ${style}. High resolution, clean vectors, isolated on white background.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: prompt }] },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};

export const generateMarketingContent = async (brand: string, type: string) => {
  const ai = getAI();
  const prompt = `Write ${type} for a brand called "${brand}". Focus on being engaging and persuasive.`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });
  return response.text;
};

export const analyzeSentiment = async (text: string): Promise<SentimentResult> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the sentiment of this text: "${text}". 
    Return JSON with score (-1 to 1), label, explanation, and percentage breakdown (positive, neutral, negative).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          label: { type: Type.STRING },
          explanation: { type: Type.STRING },
          breakdown: {
            type: Type.OBJECT,
            properties: {
              positive: { type: Type.NUMBER },
              neutral: { type: Type.NUMBER },
              negative: { type: Type.NUMBER },
            },
            required: ['positive', 'neutral', 'negative']
          }
        },
        required: ['score', 'label', 'explanation', 'breakdown']
      }
    }
  });
  return JSON.parse(response.text || '{}');
};
