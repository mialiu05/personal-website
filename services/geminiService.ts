import { GoogleGenAI, Chat } from "@google/genai";
import { AUTHOR_NAME, AUTHOR_BIO, PROJECTS, EXPERIENCE } from '../constants';

let chatSession: Chat | null = null;

const getSystemInstruction = () => {
  const projectList = PROJECTS.map(p => `- ${p.title} (${p.year}): ${p.description} [Tags: ${p.tags.join(', ')}]`).join('\n');
  const expList = EXPERIENCE.map(e => `- ${e.role} at ${e.company} (${e.period}): ${e.description}`).join('\n');

  return `
    You are the AI assistant for ${AUTHOR_NAME}'s personal portfolio website.
    Your persona is professional, concise, and knowledgeable about ${AUTHOR_NAME}.
    
    Here is the context about ${AUTHOR_NAME}:
    Role: ${AUTHOR_NAME}
    Bio: ${AUTHOR_BIO}
    
    Experience:
    ${expList}
    
    Projects:
    ${projectList}
    
    Instructions:
    - Answer questions in the first person plural (e.g., "We worked on...", "Alex believes...") or third person ("Alex is...").
    - Keep answers brief and impactful, matching the Swiss minimal design style of the site.
    - If asked about contact info, suggest using the contact form on the site.
    - Do not make up projects that are not listed.
  `;
};

export const initChat = async (): Promise<Chat> => {
  if (chatSession) return chatSession;

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key not found");
    throw new Error("API Key missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: getSystemInstruction(),
      temperature: 0.7,
    },
  });

  return chatSession;
};

export const sendMessage = async (message: string): Promise<string> => {
  try {
    const chat = await initChat();
    const result = await chat.sendMessage({ message });
    return result.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "I am currently unavailable. Please try again later.";
  }
};