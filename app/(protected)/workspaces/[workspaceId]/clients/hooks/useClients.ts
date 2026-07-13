"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createClientService,
  getClientsService,
} from "../services/clientService";
import type { Client, ClientCreatePayload } from "../types/client";

type ClientForm = ClientCreatePayload;

const initialForm: ClientForm = {
  name: "",
  email: "",
  phone: "",
  company: "",
};

function validateClientForm(form: ClientForm) {
  const payload = {
    name: form.name.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    company: form.company.trim(),
  };

  if (payload.name.length < 2) {
    return {
      error: "O nome do cliente deve ter pelo menos 2 caracteres.",
      payload: null,
    };
  }

  if (!payload.email.includes("@")) {
    return {
      error: "Informe um email válido.",
      payload: null,
    };
  }

  return {
    error: "",
    payload,
  };
}

export function useClients(workspaceId: string) {
  const [clients, setClients] = useState<Client[]>([]);
  const [form, setForm] = useState<ClientForm>(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadClients = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getClientsService(workspaceId);
      setClients(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao buscar clientes");
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  function updateForm<K extends keyof ClientForm>(
    field: K,
    value: ClientForm[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function resetForm() {
    setForm(initialForm);
  }

  async function createClient() {
    const { error: validationError, payload } = validateClientForm(form);

    if (!payload) {
      setError(validationError);
      return false;
    }

    setSaving(true);
    setError("");

    try {
      const client = await createClientService(workspaceId, payload);
      setClients((prev) => [...prev, client]);
      resetForm();
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao criar cliente");
      return false;
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    let active = true;

    async function loadInitialClients() {
      await Promise.resolve();

      if (active) {
        setLoading(true);
        setError("");
      }

      try {
        const data = await getClientsService(workspaceId);

        if (active) {
          setClients(data);
        }
      } catch (err: unknown) {
        if (active) {
          setError(err instanceof Error ? err.message : "Erro ao buscar clientes");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadInitialClients();

    return () => {
      active = false;
    };
  }, [workspaceId]);

  return {
    clients,
    form,
    loading,
    saving,
    error,
    updateForm,
    resetForm,
    createClient,
    loadClients,
  };
}
