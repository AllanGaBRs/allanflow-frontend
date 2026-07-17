export type ChecklistItem = {
  id: string;
  content: string;
  checked: boolean;
  position: number;
};

export type Checklist = {
  id: string;
  title: string;
  taskId: string;
  items: ChecklistItem[];
};

export type ChecklistCreatePayload = {
  title: string;
};

export type ChecklistUpdatePayload = {
  title: string;
};

export type ChecklistItemCreatePayload = {
  content: string;
  position?: number | null;
};

export type ChecklistItemUpdatePayload = {
  content?: string;
  checked?: boolean;
  position?: number | null;
};
