"use client";

import { useEffect, useRef } from "react";
import { useNotifications, type NotificationVariant } from "./NotificationsProvider";

type UseToastMessageOptions = {
  variant?: NotificationVariant;
  title?: string;
  durationMs?: number;
};

export function useToastMessage(
  message: string,
  options: UseToastMessageOptions = {}
) {
  const { notify } = useNotifications();
  const lastShownMessageRef = useRef("");

  useEffect(() => {
    const normalizedMessage = message.trim();

    if (!normalizedMessage) {
      lastShownMessageRef.current = "";
      return;
    }

    if (lastShownMessageRef.current === normalizedMessage) {
      return;
    }

    lastShownMessageRef.current = normalizedMessage;

    notify({
      message: normalizedMessage,
      variant: options.variant ?? "error",
      title: options.title,
      durationMs: options.durationMs,
    });
  }, [message, notify, options.durationMs, options.title, options.variant]);
}
