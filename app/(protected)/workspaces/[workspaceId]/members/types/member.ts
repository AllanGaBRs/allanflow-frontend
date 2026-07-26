export type MembershipRole = "OWNER" | "ADMIN" | "MEMBER";

export type Member = {
  userId: string;
  userName: string;
  userEmail: string;
  role: MembershipRole;
};

export type UpdateMemberRoleRequest = {
  role: MembershipRole;
};
