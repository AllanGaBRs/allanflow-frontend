export type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
};

export type ClientCreatePayload = {
  name: string;
  email: string;
  phone: string;
  company: string;
};

export type ClientUpdatePayload = ClientCreatePayload;
