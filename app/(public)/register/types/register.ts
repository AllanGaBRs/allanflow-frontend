export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export type RegisterResponse = {
  success: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  error?: string;
  details?: unknown;
};