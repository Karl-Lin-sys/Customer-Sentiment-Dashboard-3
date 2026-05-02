import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface WordData {
  text: string;
  weight: number;
  type: "praise" | "complaint" | "neutral";
}

export interface TimelineData {
  date: string;
  sentiment: number;
}

export interface SentimentReport {
  summary: string;
  actionableAreas: string[];
  overallSentiment: number;
  totalAnalyzed: number;
  timeline: TimelineData[];
  wordCloud: WordData[];
}

export async function analyzeReviews(text: string): Promise<SentimentReport> {
  const prompt = `Analyze the following batch of customer reviews. Generate a comprehensive JSON report containing:
1. "summary": A brief executive summary (max 3 sentences).
2. "actionableAreas": An array of the top 3 actionable areas for improvement based on complaints.
3. "overallSentiment": A score from 0 (very negative) to 100 (very positive).
4. "totalAnalyzed": Approximate number of reviews analyzed.
5. "timeline": An array of up to 10 objects representing sentiment over time. If explicit dates are not present in the text, infer a logical sequence (e.g., "Batch 1", "Batch 2", etc. or synthetic dates representing progression). Each object should have a "date" (string) and "sentiment" (number 0-100).
6. "wordCloud": An array of the most frequently mentioned significant words or short phrases. Include up to 40 items. Each item must have "text" (string), "weight" (number 10-100 indicating frequency/importance), and "type" ("praise", "complaint", or "neutral").

Raw Reviews:
${text}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          actionableAreas: { type: Type.ARRAY, items: { type: Type.STRING } },
          overallSentiment: { type: Type.NUMBER },
          totalAnalyzed: { type: Type.NUMBER },
          timeline: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                date: { type: Type.STRING },
                sentiment: { type: Type.NUMBER },
              },
              required: ["date", "sentiment"],
            },
          },
          wordCloud: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                weight: { type: Type.NUMBER },
                type: { type: Type.STRING },
              },
              required: ["text", "weight", "type"],
            },
          },
        },
        required: [
          "summary",
          "actionableAreas",
          "overallSentiment",
          "totalAnalyzed",
          "timeline",
          "wordCloud",
        ],
      },
    },
  });

  const rawText = response.text;
  if (!rawText) {
    throw new Error("No response from AI");
  }

  return JSON.parse(rawText) as SentimentReport;
}
