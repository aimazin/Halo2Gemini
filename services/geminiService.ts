
import { GoogleGenAI, Type } from "@google/genai";
import type { HistoricalPrice, PredictionResult } from "../types";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const fetchPrediction = async (
  historicalData: HistoricalPrice[],
  supplyIndicator: number,
  demandIndicator: number
): Promise<PredictionResult> => {
  const assetName = historicalData[0]?.name || 'the asset';
  
  // As per requirement: "open price 3 steps behind closing to be predicted"
  // We want to predict Close for Day 0, so we use Open from Day -3.
  const relevantOpenPrice = historicalData[historicalData.length - 3]?.open;

  if (relevantOpenPrice === undefined) {
    throw new Error("Not enough historical data to make a prediction. Need at least 3 days.");
  }

  const prompt = `
    You are a sophisticated financial modeling expert AI, acting as an ensemble of machine learning models (including SVR for supply/demand and other models for price action). Your task is to predict the next closing price for ${assetName}.

    I will provide you with:
    1.  Recent historical price data (Open and Close).
    2.  The Open price from 3 days ago, which is a key feature for this prediction.
    3.  A supply indicator (e.g., trading volume).
    4.  A demand indicator (e.g., based on jobs reports).

    Analyze all this information to provide a single, precise numerical prediction for the closing price for "Day 0".

    **Data:**
    - **Asset:** ${assetName}
    - **Historical Data (Last 10 Days):**
      ${historicalData.map(p => `  - ${p.date}: Open=${p.open.toFixed(2)}, Close=${p.close.toFixed(2)}`).join('\n')}
    - **Key Feature (Open Price 3 steps behind):** ${relevantOpenPrice.toFixed(2)}
    - **Supply Indicator (Volume):** ${supplyIndicator.toLocaleString()}
    - **Demand Indicator (Jobs Report proxy):** ${demandIndicator.toLocaleString()}

    Based on this data, provide your prediction and a brief justification for your reasoning.
    `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        seed: 42, // For reproducibility
        temperature: 0.3,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            prediction: {
              type: Type.NUMBER,
              description: "The predicted closing price.",
            },
            reasoning: {
              type: Type.STRING,
              description: "A brief explanation of the factors influencing the prediction.",
            },
          },
          required: ["prediction", "reasoning"],
        },
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    
    if (typeof result.prediction !== 'number' || typeof result.reasoning !== 'string') {
        throw new Error("Invalid response format from API.");
    }
    
    return result;

  } catch (error) {
    console.error("Error fetching prediction from Gemini API:", error);
    throw new Error("Failed to get a prediction. The model may be unavailable or the request was invalid.");
  }
};
