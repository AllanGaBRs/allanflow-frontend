"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createClientService,
  deleteClientService,
  getClientService,
  getClientsService,
  updateClientService,
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

  if (payload.email && !payload.email.includes("@")) {
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
    setError("");
  }

  function fillForm(client: Client) {
    setForm({
      name: client.name,
      email: client.email,
      phone: client.phone ?? "",
      company: client.company ?? "",
    });
    setError("");
  }

  async function loadClientForEdit(clientId: string) {
    setSaving(true);
    setError("");

    try {
      const client = await getClientService(workspaceId, clientId);
      fillForm(client);
      return client;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao buscar cliente");
      return null;
    } finally {
      setSaving(false);
    }
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

  async function updateClient(clientId: string) {
    const { error: validationError, payload } = validateClientForm(form);

    if (!payload) {
      setError(validationError);
      return false;
    }

    setSaving(true);
    setError("");

    try {
      const updatedClient = await updateClientService(
        workspaceId,
        clientId,
        payload
      );
      setClients((currentClients) =>
        currentClients.map((client) =>
          client.id === clientId ? updatedClient : client
        )
      );
      resetForm();
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar cliente");
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function deleteClient(clientId: string) {
    setSaving(true);
    setError("");

    try {
      await deleteClientService(workspaceId, clientId);
      setClients((currentClients) =>
        currentClients.filter((client) => client.id !== clientId)
      );
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao excluir cliente");
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
    loadClientForEdit,
    createClient,
    updateClient,
    deleteClient,
    loadClients,
  };
}
