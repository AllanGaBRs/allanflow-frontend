"use client";

import { useState } from "react";
import { changePasswordService } from "../services/changePasswordService";
import type { ChangePasswordFormData } from "../types/changePassword";

const initialForm: ChangePasswordFormData = {
  currentPassword: "",
  newPassword: "",
  passwordConfirmation: "",
};

function validateForm(form: ChangePasswordFormData) {
  if (!form.currentPassword.trim()) {
    return "Informe sua senha atual.";
  }

  if (form.newPassword.length < 6) {
    return "A nova senha deve ter pelo menos 6 caracteres.";
  }

  if (form.newPassword.length > 100) {
    return "A nova senha deve ter no máximo 100 caracteres.";
  }

  if (form.newPassword !== form.passwordConfirmation) {
    return "As senhas não coincidem.";
  }

  if (form.currentPassword === form.newPassword) {
    return "A nova senha deve ser diferente da senha atual.";
  }

  return "";
}

export function useChangePassword() {
  const [form, setForm] = useState<ChangePasswordFormData>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateForm<K extends keyof ChangePasswordFormData>(
    field: K,
    value: ChangePasswordFormData[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function resetForm() {
    setForm(initialForm);
    setError("");
  }

  async function changePassword() {
    const validationError = validateForm(form);

    if (validationError) {
      setError(validationError);
      return false;
    }

    setLoading(true);
    setError("");

    try {
      await changePasswordService({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      setForm(initialForm);
      return true;
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Erro inesperado ao alterar senha."
      );
      return false;
    } finally {
      setLoading(false);
    }
  }

  return {
    form,
    loading,
    error,
    updateForm,
    resetForm,
    changePassword,
  };
}
