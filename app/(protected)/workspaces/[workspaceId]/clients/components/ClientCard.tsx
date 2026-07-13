import { Building2, Mail, Phone } from "lucide-react";
import type { Client } from "../types/client";

type ClientCardProps = {
  client: Client;
};

export function ClientCard({ client }: ClientCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-slate-950">
            {client.name}
          </h3>
          {client.company && (
            <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
              <Building2 size={16} />
              <span className="min-w-0 truncate">{client.company}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 text-sm text-slate-600">
        <a
          href={`mailto:${client.email}`}
          className="flex min-w-0 items-center gap-2 hover:text-blue-700"
        >
          <Mail size={16} />
          <span className="truncate">{client.email}</span>
        </a>

        {client.phone && (
          <a
            href={`tel:${client.phone}`}
            className="flex min-w-0 items-center gap-2 hover:text-blue-700"
          >
            <Phone size={16} />
            <span className="truncate">{client.phone}</span>
          </a>
        )}
      </div>
    </article>
  );
}
