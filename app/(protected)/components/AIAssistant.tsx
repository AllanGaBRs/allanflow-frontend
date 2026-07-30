"use client";

import { useEffect, useRef, type FormEvent } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Bot, Sparkles, Send, X } from "lucide-react";
import { useToastMessage } from "@/components/notifications/useToastMessage";
import { useAIAssistant } from "../hooks/useAIAssistant";

function getMessageStyles(role: "user" | "assistant") {
  if (role === "user") {
    return "ml-auto rounded-2xl rounded-br-md bg-blue-600 text-white";
  }

  return "mr-auto rounded-2xl rounded-bl-md border border-slate-200 bg-slate-50 text-slate-800";
}

export function AIAssistant() {
  const {
    isOpen,
    messages,
    input,
    sending,
    error,
    openAssistant,
    closeAssistant,
    setInput,
    sendMessage,
  } = useAIAssistant();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useToastMessage(error, { title: "AI Assistente" });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [isOpen, messages]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeAssistant();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeAssistant, isOpen]);

  async function handleSend() {
    await sendMessage(input);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await handleSend();
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 sm:bottom-8 sm:right-8">
      <LayoutGroup>
        <AnimatePresence initial={false} mode="wait">
          {!isOpen ? (
            <motion.button
              key="ai-assistant-closed"
              layoutId="ai-assistant-shell"
              type="button"
              onClick={openAssistant}
              aria-label="Abrir AI Assistente"
              className="inline-flex h-14 items-center gap-3 rounded-full bg-slate-950 px-5 text-sm font-semibold text-white shadow-[0_20px_45px_-15px_rgba(15,23,42,0.45)] transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-white">
                <Sparkles size={18} />
              </span>
              <span className="hidden sm:inline">AI Assistente</span>
            </motion.button>
          ) : (
            <motion.div
              key="ai-assistant-open"
              layoutId="ai-assistant-shell"
              className="w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
              role="dialog"
              aria-modal="false"
              aria-labelledby="ai-assistant-title"
              initial={{ opacity: 0.2, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.2, scale: 0.98 }}
              transition={{ duration: 0.18 }}
            >
              <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-gradient-to-r from-slate-950 to-slate-800 px-5 py-4 text-white">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white">
                    <Bot size={20} />
                  </div>

                  <div className="min-w-0">
                    <h2 id="ai-assistant-title" className="text-base font-semibold">
                      AI Assistente
                    </h2>
                    <p className="mt-0.5 text-sm text-white/70">
                      Tire dúvidas sobre como este projeto foi feito.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeAssistant}
                  disabled={sending}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-white/80 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                  aria-label="Fechar assistente"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex h-[min(34rem,calc(100vh-9rem))] min-h-0 flex-col bg-slate-50">
                <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
                  <div className="flex min-h-full flex-col gap-3">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`max-w-[85%] px-4 py-3 text-sm leading-6 shadow-sm ${getMessageStyles(
                          message.role
                        )}`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                    ))}

                    {sending && (
                      <div className="mr-auto max-w-[85%] rounded-2xl rounded-bl-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-500 shadow-sm">
                        Pensando...
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="border-t border-slate-200 bg-white p-4 sm:p-5"
                >
                  <label
                    htmlFor="ai-assistant-message"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Sua mensagem
                  </label>

                  <textarea
                    ref={inputRef}
                    id="ai-assistant-message"
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        void handleSend();
                      }
                    }}
                    rows={2}
                    maxLength={2000}
                    disabled={sending}
                    placeholder="Ex.: Como o Allan implementou RBAC nesse projeto?"
                    className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm leading-6 text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-500"
                  />

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="text-xs text-slate-500">
                      Enter envia a mensagem. Shift+Enter quebra linha.
                    </p>

                    <button
                      type="submit"
                      disabled={sending || !input.trim()}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Send size={16} />
                      {sending ? "Enviando..." : "Enviar"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </LayoutGroup>
    </div>
  );
}
