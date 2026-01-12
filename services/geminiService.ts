
import { GoogleGenAI, Type } from "@google/genai";
import { VPNServer } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getSecurityAdvice = async (server: VPNServer) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze the security profile of connecting to a VPN server in ${server.city}, ${server.country}. Current server load is ${server.load}% and latency is ${server.latency}ms. Provide a brief, professional privacy recommendation.`,
      config: {
        systemInstruction: "You are a world-class cybersecurity expert specialized in VPN technology and digital privacy. Keep advice under 60 words.",
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Ensure Multi-Hop is enabled for maximum privacy when connecting to high-load servers.";
  }
};

export const getSmartServerRecommendation = async (servers: VPNServer[]) => {
  try {
    const serverList = servers.map(s => `${s.city} (${s.country}): load ${s.load}%, latency ${s.latency}ms`).join(', ');
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on these servers: ${serverList}, pick the best one for a user who prioritizes both speed and security. Explain why briefly.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedServerId: { type: Type.STRING },
            reasoning: { type: Type.STRING }
          },
          required: ["recommendedServerId", "reasoning"]
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    return { recommendedServerId: '1', reasoning: 'Standard optimization based on current network metrics.' };
  }
};
