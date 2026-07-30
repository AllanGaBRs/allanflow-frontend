import { api } from "@/app/api/api";
import type { AIChatResponse } from "../types/aiAssistant";

export async function sendAIChatMessageService(message: string) {
  const { data } = await api.post<AIChatResponse>("/ai/chat", { message });
  return data;
}
