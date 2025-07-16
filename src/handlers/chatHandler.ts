import { getChatClient } from "../clients/engineFactory";

export async function handleChat(message: string, engine: "openai" | "deepseek"): Promise<string> {
  const chatClient = getChatClient(engine);
  return chatClient(message);
}