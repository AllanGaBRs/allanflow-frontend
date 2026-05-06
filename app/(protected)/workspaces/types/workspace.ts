export type Workspace = {
  id: string;
  name: string;
  userRole?: "OWNER" | "ADMIN" | "MEMBER";
};

export type CreateWorkspaceRequest = {
  name: string;
};
