"use client";

import { useState } from "react";
import {
  sendAIChatMessageService,
} from "../services/aiAssistantService";
import type { AIAssistantMessage } from "../types/aiAssistant";

function createMessageId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function createAssistantMessage(content: string): AIAssistantMessage {
  return {
    id: createMessageId(),
    role: "assistant",
    content,
  };
}

const welcomeMessage = createAssistantMessage(
  "Olá! Eu sou o AI Assistente. Posso responder dúvidas sobre como este projeto foi feito e como as partes da interface foram organizadas."
);

export function useAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AIAssistantMessage[]>([
    welcomeMessage,
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  function openAssistant() {
    setIsOpen(true);
  }

  function closeAssistant() {
    if (sending) {
      return;
    }

    setIsOpen(false);
  }

  async function sendMessage(rawMessage: string) {
    const message = rawMessage.trim();

    if (!message) {
      setError("Digite uma mensagem para continuar.");
      return false;
    }

    setSending(true);
    setError("");
    setInput("");

    const userMessage: AIAssistantMessage = {
      id: createMessageId(),
      role: "user",
      content: message,
    };

    setMessages((current) => [...current, userMessage]);

    try {
      const response = await sendAIChatMessageService(message);

      setMessages((current) => [
        ...current,
        createAssistantMessage(response.answer),
      ]);

      return true;
    } catch (err: unknown) {
      const fallbackMessage =
        err instanceof Error
          ? err.message
          : "Não consegui responder agora. Tente novamente em instantes.";

      setError(fallbackMessage);
      setMessages((current) => [
        ...current,
        createAssistantMessage(
          "Não consegui responder agora. Tente novamente em instantes."
        ),
      ]);
      return false;
    } finally {
      setSending(false);
    }
  }

  return {
    isOpen,
    messages,
    input,
    sending,
    error,
    openAssistant,
    closeAssistant,
    setInput,
    sendMessage,
  };
}
