"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Info, X, XCircle } from "lucide-react";

export type NotificationVariant = "error" | "warning" | "success" | "info";

type NotificationInput = {
  message: string;
  variant?: NotificationVariant;
  title?: string;
  durationMs?: number;
};

type Notification = NotificationInput & {
  id: string;
};

type NotificationsContextValue = {
  notify: (notification: NotificationInput) => void;
  dismiss: (id: string) => void;
};

const NotificationsContext = createContext<NotificationsContextValue | null>(
  null
);

function getNotificationStyles(variant: NotificationVariant) {
  switch (variant) {
    case "success":
      return {
        container: "border-emerald-200 bg-emerald-50 text-emerald-950",
        accent: "bg-emerald-500",
        icon: CheckCircle2,
        iconClassName: "text-emerald-600",
      };
    case "warning":
      return {
        container: "border-amber-200 bg-amber-50 text-amber-950",
        accent: "bg-amber-500",
        icon: AlertCircle,
        iconClassName: "text-amber-600",
      };
    case "info":
      return {
        container: "border-sky-200 bg-sky-50 text-sky-950",
        accent: "bg-sky-500",
        icon: Info,
        iconClassName: "text-sky-600",
      };
    case "error":
    default:
      return {
        container: "border-rose-200 bg-rose-50 text-rose-950",
        accent: "bg-rose-500",
        icon: XCircle,
        iconClassName: "text-rose-600",
      };
  }
}

function createNotificationId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function NotificationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const dismiss = useCallback((id: string) => {
    setNotifications((current) => current.filter((item) => item.id !== id));
  }, []);

  const notify = useCallback(
    (notification: NotificationInput) => {
      const id = createNotificationId();
      const durationMs = notification.durationMs ?? 5000;

      setNotifications((current) => [
        ...current,
        {
          id,
          message: notification.message,
          variant: notification.variant ?? "error",
          title: notification.title,
          durationMs,
        },
      ]);

      window.setTimeout(() => {
        dismiss(id);
      }, durationMs);
    },
    [dismiss]
  );

  useEffect(() => {
    return () => {
      setNotifications([]);
    };
  }, []);

  const value = useMemo(
    () => ({
      notify,
      dismiss,
    }),
    [dismiss, notify]
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}

      <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3 sm:right-6 sm:top-6">
        <AnimatePresence initial={false}>
          {notifications.map((notification) => {
            const styles = getNotificationStyles(
              notification.variant ?? "error"
            );
            const Icon = styles.icon;

            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: -12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.18 }}
                className={`pointer-events-auto overflow-hidden rounded-2xl border shadow-xl ${styles.container}`}
              >
                <div className={`h-1 w-full ${styles.accent}`} />
                <div className="flex items-start gap-3 p-4">
                  <div className={`mt-0.5 shrink-0 ${styles.iconClassName}`}>
                    <Icon size={18} aria-hidden="true" />
                  </div>

                  <div className="min-w-0 flex-1">
                    {notification.title && (
                      <p className="text-sm font-semibold">
                        {notification.title}
                      </p>
                    )}
                    <p className="mt-0.5 text-sm leading-6">
                      {notification.message}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => dismiss(notification.id)}
                    className="shrink-0 rounded-full p-1 text-current/60 transition hover:bg-black/5 hover:text-current focus:outline-none focus:ring-2 focus:ring-current/20"
                    aria-label="Fechar notificação"
                  >
                    <X size={16} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);

  if (!context) {
    throw new Error("useNotifications must be used within NotificationsProvider");
  }

  return context;
}
