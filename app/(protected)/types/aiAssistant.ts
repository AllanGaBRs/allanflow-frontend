export type AIAssistantRole = "user" | "assistant";

export type AIAssistantMessage = {
  id: string;
  role: AIAssistantRole;
  content: string;
};

export type AIChatResponse = {
  answer: string;
};
