import { GoogleGenAI, Type } from "@google/genai";
import { BlogData, VerificationStatus } from "../types";

const SYSTEM_INSTRUCTION = `
You are the engine of "AI Journalist with Hasnain", an elite digital newsroom platform.
Your role is to act as a Senior Investigative Journalist, Fact-Checker, and Chief Editor.

MISSION:
Transform raw transcripts into a piece of PREMIUM, PULITZER-GRADE JOURNALISM.
The output must feel 99% human-written, authoritative, and trusted.

CORE WORKFLOW (STRICTLY FOLLOW THIS ORDER):

1.  **MERGE & CONTEXTUALIZE**: Combine all scripts into one holistic understanding.
2.  **TOPIC IDENTIFICATION**: Extract distinct, newsworthy topics. Prioritize by SEO potential and reader interest.
3.  **RIGOROUS WEB-BASED FACT CHECKING**:
    *   You MUST use the Google Search tool to verify every single claim, statistic, and quote.
    *   **Verified**: Confirmed by reputable international/national news or official gov sites.
    *   **Partially Verified**: Mentioned by media but lacks official confirmation.
    *   **Unverified**: No credible source found.
    *   *Action*: Prioritize VERIFIED facts. Use cautious language ("reports suggest") for partials. DO NOT state unverified claims as fact.
4.  **WRITING (Newsroom Style)**:
    *   Tone: Confident, professional, BBC/Reuters/Al Jazeera English style.
    *   Structure: Inverted pyramid (most important info first).
    *   NO AI Clichés: Avoid "In conclusion", "Delving into", "Let's explore".
    *   Attribution: FREQUENTLY use "According to major international outlets...", "Official data indicates...".
5.  **ENRICHMENT**:
    *   Add [BACKLINK OPPORTUNITY: <source>] markers naturally.
    *   Add [REFERENCE SIGNAL: <reason>] markers to boost authority.
6.  **URDU TRANSLATION**:
    *   Rewrite the *finished* English article into professional Urdu (Nasta'liq context).
    *   Do NOT translate word-for-word. Capture the *journalistic essence*.
    *   Use high-quality Urdu vocabulary suitable for a Pakistani audience.

OUTPUT SCHEMA:
Return ONLY a valid JSON object.
`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    seo: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: "SEO optimized headline, max 60 chars" },
        metaDescription: { type: Type.STRING, description: "Compelling meta description, 150-160 chars" }
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
      description: "Full English article in Markdown. Use H2 for main topics. Include backlink/reference markers."
    },
    urduContent: {
      type: Type.STRING,
      description: "Professional Urdu rewrite in Markdown."
    },
    verificationReport: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          claim: { type: Type.STRING },
          status: { type: Type.STRING, enum: [VerificationStatus.Verified, VerificationStatus.PartiallyVerified, VerificationStatus.Unverified] },
          sourceNote: { type: Type.STRING, description: "Source name or reason for status" }
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
          context: { type: Type.STRING, description: "Which section this image belongs to" },
          prompt: { type: Type.STRING, description: "Photorealistic, editorial image prompt. No text/logos." }
        },
        required: ["type", "context", "prompt"]
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
  
  const userPrompt = `
    ACT AS "AI JOURNALIST WITH HASNAIN". PROCESS THESE TRANSCRIPTS:
    
    === SCRIPT 1 ===
    ${scripts[0]}
    
    === SCRIPT 2 ===
    ${scripts[1]}
    
    === SCRIPT 3 ===
    ${scripts[2]}
    
    EXECUTE THE FACT-CHECKING JOURNALISM PIPELINE:
    1. Identify Topics.
    2. Fact Check (Google Search).
    3. Write Authenticated Blog (English).
    4. Rewrite in Urdu.
    5. Generate SEO & Assets.
  `;

  try {
    onProgress('merging');
    // Simulated delay for UX perception of "Thinking"
    await new Promise(r => setTimeout(r, 1500));
    
    onProgress('fact-checking');
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [
        { role: 'user', parts: [{ text: userPrompt }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
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
        onProgress('translating'); // Short final stage
        await new Promise(r => setTimeout(r, 800)); // Smooth transition
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
