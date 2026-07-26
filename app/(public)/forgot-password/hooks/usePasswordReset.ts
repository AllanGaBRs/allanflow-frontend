"use client";

import { useState } from "react";
import {
  requestPasswordResetService,
  resetPasswordService,
} from "../services/passwordResetService";

type PasswordResetStep = "request" | "reset" | "success";

export function usePasswordReset() {
  const [step, setStep] = useState<PasswordResetStep>("request");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function requestCode(requestEmail: string) {
    setLoading(true);
    setError("");

    try {
      const normalizedEmail = requestEmail.trim().toLowerCase();

      await requestPasswordResetService({ email: normalizedEmail });
      setEmail(normalizedEmail);
      setStep("reset");
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível enviar o código. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  }

  async function resetPassword(code: string, newPassword: string) {
    setLoading(true);
    setError("");

    try {
      await resetPasswordService({
        email,
        code: code.trim().toUpperCase(),
        newPassword,
      });
      setStep("success");
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível redefinir a senha. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  }

  function restart() {
    setError("");
    setStep("request");
  }

  return {
    email,
    error,
    loading,
    requestCode,
    resetPassword,
    restart,
    step,
  };
}
