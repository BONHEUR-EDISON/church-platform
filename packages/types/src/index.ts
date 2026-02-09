export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  CHURCH_ADMIN = "CHURCH_ADMIN",
  PASTOR = "PASTOR",
  MEMBER = "MEMBER"
}

export type JwtPayload = {
  userId: string;
  churchId: string;
  role: Role;
};
