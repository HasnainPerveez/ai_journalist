import { GoogleGenAI, Type } from "@google/genai";
import { BlogData, VerificationStatus } from "../types";

// In a real production app, this prompt would be refined and potentially split into a chain.
// For this single-shot implementation, we use a comprehensive system instruction.

const SYSTEM_INSTRUCTION = `
You are an elite AI Investigative Journalist, Chief Editor, and Fact-Checker for a top-tier international news agency.
Your goal is to synthesize raw transcripts into a piece of Pulitzer-grade journalism.

ROLE & RESPONSIBILITIES:
1. MERGE & ANALYZE: Read the provided transcripts. Identify distinct, newsworthy topics.
2. RIGOROUS FACT-CHECKING (CRITICAL):
   - You MUST use Google Search to verify every factual claim, statistic, and quote.
   - Categorize claims as "Verified", "Partially Verified", or "Unverified".
   - PRIORITIZE verified facts. Use cautious language ("allegedly", "reports suggest") for partially verified info.
   - DO NOT present unverified claims as facts.
3. WRITING STYLE (Human-Centric):
   - Write in a confident, professional newsroom voice (BBC/Reuters style).
   - NO "In this blog post" or "Here is a summary". Dive straight into the story.
   - Use phrasing like "According to reports...", "Official data indicates...".
   - 99% Human-Like: Vary sentence structure. Avoid repetitive AI patterns.
4. URDU TRANSLATION:
   - Rewrite the final article in professional, journalistic Urdu (Nasta'liq style context).
   - NOT a literal translation. Adapt for flow and cultural nuance.

OUTPUT FORMAT:
Return ONLY a valid JSON object matching the requested schema. Do not wrap in markdown code blocks.
`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    seo: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: "SEO optimized title, max 60 chars" },
        metaDescription: { type: Type.STRING, description: "SEO meta description, 150-160 chars" }
      },
      required: ["title", "metaDescription"]
    },
    tableOfContents: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of H2/H3 headings"
    },
    blogContent: {
      type: Type.STRING,
      description: "The full English blog post in Markdown format. Use H2, H3, bolding. Include [BACKLINK OPPORTUNITY] and [REFERENCE SIGNAL] markers."
    },
    urduContent: {
      type: Type.STRING,
      description: "The full Urdu translation in Markdown format."
    },
    verificationReport: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          claim: { type: Type.STRING },
          status: { type: Type.STRING, enum: [VerificationStatus.Verified, VerificationStatus.PartiallyVerified, VerificationStatus.Unverified] },
          sourceNote: { type: Type.STRING, description: "Brief note on the source or reason for status" }
        },
        required: ["claim", "status", "sourceNote"]
      }
    },
    imagePrompts: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING, enum: ["Feature", "Topic"] },
          context: { type: Type.STRING },
          prompt: { type: Type.STRING, description: "Highly detailed, photorealistic prompt. No text in image." }
        },
        required: ["type", "prompt"]
      }
    },
    internalLinks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          anchorText: { type: Type.STRING },
          placementContext: { type: Type.STRING }
        },
        required: ["anchorText", "placementContext"]
      }
    }
  },
  required: ["seo", "tableOfContents", "blogContent", "urduContent", "verificationReport", "imagePrompts", "internalLinks"]
};

export const generateBlogFromScripts = async (
  scripts: string[], 
  apiKey: string,
  onProgress: (stage: string) => void
): Promise<BlogData> => {
  
  const ai = new GoogleGenAI({ apiKey });
  
  // Combine scripts into a structured user prompt
  const userPrompt = `
    PROCESS THESE 3 SOURCE SCRIPTS:
    
    --- SCRIPT 1 ---
    ${scripts[0]}
    
    --- SCRIPT 2 ---
    ${scripts[1]}
    
    --- SCRIPT 3 ---
    ${scripts[2]}
    
    EXECUTE THE FACT-CHECKING JOURNALISM PIPELINE. 
    1. Identify main topics.
    2. Fact check all claims using Google Search.
    3. Write the authenticated blog post.
    4. Generate Urdu version.
    5. Generate Assets (SEO, Images).
  `;

  try {
    onProgress('merging');
    // We use a short timeout to simulate the feeling of stages, 
    // though the API call is monolithic in this design for consistency.
    await new Promise(r => setTimeout(r, 1000));
    
    onProgress('fact-checking');
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Using Pro for reasoning and search
      contents: [
        { role: 'user', parts: [{ text: userPrompt }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }], // Enable Search Grounding
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      }
    });

    onProgress('writing');
    
    const responseText = response.text;
    if (!responseText) {
      throw new Error("No response generated from AI.");
    }

    try {
        const data = JSON.parse(responseText) as BlogData;
        onProgress('translating'); // Just a visual step before return
        return data;
    } catch (parseError) {
        console.error("JSON Parse Error", parseError, responseText);
        throw new Error("Failed to parse the AI response. It might not be valid JSON.");
    }

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
