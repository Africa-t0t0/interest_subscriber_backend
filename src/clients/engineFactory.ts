import { askDeepSeek } from "./deepseek";
import { askOpenAI } from "./openai";

type SupportedEngine = "openai" | "deepseek";

export function getChatClient(engine: SupportedEngine) {
    switch (engine) {
      case "openai":
        return askOpenAI;
      case "deepseek":
        return askDeepSeek;
      default:
        throw new Error(`Engine "${engine}" no soportado`);
    }
  }