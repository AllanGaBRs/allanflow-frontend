import type { DocumentContent } from "../types/document";

type Draft = { title: string; content: DocumentContent };
type Save = (title: string, content: DocumentContent) => Promise<boolean>;

function snapshot(draft: Draft) {
  return JSON.stringify([draft.title.trim(), draft.content]);
}

export class DocumentAutosave {
  private draft: Draft;
  private saved: string;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private inFlight: Promise<boolean> | null = null;
  private save: Save;
  private onStatus: (status: string) => void;

  constructor(draft: Draft, save: Save, onStatus: (status: string) => void) {
    this.draft = draft;
    this.saved = snapshot(draft);
    this.save = save;
    this.onStatus = onStatus;
  }

  get pending() {
    return this.inFlight !== null || snapshot(this.draft) !== this.saved;
  }

  change(update: Partial<Draft>) {
    this.draft = { ...this.draft, ...update };
    this.cancelTimer();
    if (!this.pending) {
      this.onStatus("Salvo");
      return;
    }
    this.onStatus("Aguardando...");
    this.timer = setTimeout(() => { void this.flush(); }, 400);
  }

  private cancelTimer() {
    if (this.timer !== null) clearTimeout(this.timer);
    this.timer = null;
  }

  flush(): Promise<boolean> {
    this.cancelTimer();
    if (this.inFlight) return this.inFlight;
    this.inFlight = Promise.resolve().then(async () => {
      try {
        while (snapshot(this.draft) !== this.saved) {
          const draft = this.draft;
          const title = draft.title.trim();
          if (title.length < 2 || title.length > 255) {
            this.onStatus("O título deve ter entre 2 e 255 caracteres");
            return false;
          }
          this.onStatus("Salvando...");
          if (!await this.save(title, draft.content)) {
            this.onStatus("Erro ao salvar");
            return false;
          }
          this.saved = snapshot(draft);
        }
        this.onStatus("Salvo");
        return true;
      } catch {
        this.onStatus("Erro ao salvar");
        return false;
      } finally {
        this.inFlight = null;
      }
    });
    return this.inFlight;
  }
}
