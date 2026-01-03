
import { GoogleGenAI, Type } from "@google/genai";
import { Category, Difficulty, MathProblem } from "../types";

// Fungsi untuk mendapatkan instance AI secara aman
const getAI = () => {
  const apiKey = process.env.API_KEY || '';
  return new GoogleGenAI({ apiKey });
};

export const generateMathProblems = async (
  category: Category,
  difficulty: Difficulty,
  count: number = 5
): Promise<MathProblem[]> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Hasilkan ${count} soal matematika untuk anak-anak sekolah dasar.
      Kategori: ${category}
      Tingkat Kesulitan: ${difficulty}
      Berikan soal dalam Bahasa Indonesia yang ramah anak.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            question: { type: Type.STRING },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Empat pilihan jawaban"
            },
            correctAnswer: { type: Type.STRING },
            explanation: { type: Type.STRING, description: "Penjelasan singkat kenapa jawaban itu benar" },
            hint: { type: Type.STRING, description: "Petunjuk jika anak kesulitan" }
          },
          required: ["id", "question", "options", "correctAnswer", "explanation", "hint"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse math problems:", e);
    return [];
  }
};

export const getMathExplanation = async (question: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Jelaskan konsep matematika ini kepada anak umur 7-10 tahun secara menyenangkan dan mudah dimengerti: ${question}`,
    config: {
      systemInstruction: "Kamu adalah 'Profesor Robot', guru matematika yang ceria dan sabar. Gunakan analogi buah-buahan atau mainan."
    }
  });
  return response.text || "Maaf, Profesor Robot sedang berpikir keras. Coba tanya lagi ya!";
};

export const speakText = async (text: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Katakan dengan ceria: ${text}` }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const audioData = decodeBase64(base64Audio);
      const audioBuffer = await decodeAudioData(audioData, audioCtx, 24000, 1);
      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtx.destination);
      source.start();
    }
  } catch (error) {
    console.error("TTS failed", error);
  }
};

// Audio Helpers
function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
