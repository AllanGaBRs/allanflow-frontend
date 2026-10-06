export type DocumentType = "FILE" | "FOLDER";

export type DocumentContent = Record<string, unknown> | null;

export type DocumentItem = {
  id: string;
  title: string;
  type: DocumentType;
  parentId: string | null;
  content: DocumentContent;
};

export type DocumentTreeItem = {
  id: string;
  title: string;
  type: DocumentType;
  parentId: string | null;
  children: DocumentTreeItem[];
};

export type DocumentCreatePayload = {
  title: string;
  type: DocumentType;
  parentId?: string | null;
  content?: DocumentContent;
};

export type DocumentUpdatePayload = {
  title: string;
  content?: DocumentContent;
};

export type DocumentMovePayload = {
  parentId: string | null;
};
