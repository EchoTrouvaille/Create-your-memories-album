
import { GoogleGenAI, Type } from "@google/genai";
import { MemoryPhoto } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateAlbumTitle(photos: MemoryPhoto[], userName: string): Promise<{ title: string; subtitle: string }> {
  const model = 'gemini-3-flash-preview';

  // 将照片切片为 12 张（全量分析）
  const imageParts = photos.slice(0, 12).map(p => ({
    inlineData: {
      mimeType: 'image/jpeg',
      data: p.base64.split(',')[1]
    }
  }));

  const prompt = `你是一个复古音乐制作人。请分析这12张代表用户一年中每个月记忆的照片。
  1. 根据照片的整体情感色调（如怀旧、热烈、孤独、成长等），生成一个极具“黑胶唱片”封面感的专辑标题。
  2. 标题要求：中文，4-6字，避免平庸。
  3. 副标题要求：英文，富有诗意，像一首老歌的歌词。
  4. 用户名是：${userName}。
  请以 JSON 格式返回，包含 title 和 subtitle 两个字段。`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: { parts: [...imageParts, { text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            subtitle: { type: Type.STRING }
          },
          required: ["title", "subtitle"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      title: `${userName}的年度回响`,
      subtitle: "The Echoes of Time - A Twelve Month Collection"
    };
  }
}
