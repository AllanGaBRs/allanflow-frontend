export type Column = {
  id: string;
  name: string;
  position: number;
};

export type Board = {
  id: string;
  name: string;
  description: string | null;
  columns: Column[];
};

export type BoardCreatePayload = {
  name: string;
  description?: string;
};

export type BoardUpdatePayload = {
  name?: string;
  description?: string;
};

export type ColumnCreatePayload = {
  name: string;
  position?: number;
};

export type ColumnUpdatePayload = {
  name?: string;
  position?: number;
};
