export type WorkspaceDetails = {
  id: string;
  name: string;
  userRole?: "OWNER" | "ADMIN" | "MEMBER";
  createdAt?: string;
  updatedAt?: string;
};
