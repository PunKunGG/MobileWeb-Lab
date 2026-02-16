import { getAI, getGenerativeModel } from "firebase/ai";
import { app } from "./firebase";
import type { ImageAnalysisResult } from "./ai.interface";

export async function analyzeImage(
  base64Image: string,
): Promise<ImageAnalysisResult> {
  const ai = getAI(app);

  const model = getGenerativeModel(ai, {
    model: "gemini-2.5-flash",
  });

  const prompt = `
Analyze the given image and return ONLY valid JSON that matches this schema:

{
  "description": string,
  "tags": string[],
  "objects": string[]
}

Do not include markdown, code fences, or any extra text outside the JSON.
  `.trim();

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: "image/jpeg",
        data: base64Image.split(",")[1],
      },
    },
    { text: prompt },
  ]);

  const text = result.response.text();

  // กันเคสโมเดลแถม ```json ... ``` มา
  const cleaned = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  let parsed: ImageAnalysisResult;
  try {
    parsed = JSON.parse(cleaned) as ImageAnalysisResult;
  } catch (e) {
    console.error("Failed to parse Gemini JSON:", text);
    throw new Error("Gemini returned invalid JSON");
  }

  return parsed;
}
