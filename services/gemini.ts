
import { GoogleGenAI, Type } from "@google/genai";
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
  const prompt = `Generate a modern, minimalist, professional SVG logo for a brand named "${brandName}". 
  The brand is in the ${industry} industry. 
  Style: ${style}. 
  Requirements:
  - Return ONLY the raw <svg> code.
  - No explanations or markdown code blocks.
  - Use high-contrast colors (like black, indigo, or slate).
  - Include the brand name "${brandName}" inside the SVG with a clean sans-serif font.
  - Ensure it has a viewBox="0 0 400 400".
  - Make it look premium and vector-based.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });

  const text = response.text || '';
  // Extract SVG if the model wrapped it in markdown
  const svgMatch = text.match(/<svg[\s\S]*?<\/svg>/);
  return svgMatch ? svgMatch[0] : null;
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
