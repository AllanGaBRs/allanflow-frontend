export type Label = {
  id: string;
  name: string;
  color: string;
};

export type LabelCreatePayload = {
  name: string;
  color: string;
};

export type LabelUpdatePayload = {
  name: string;
  color: string;
};
