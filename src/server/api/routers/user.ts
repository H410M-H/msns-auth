export interface User {
  id: string;
  username: string;
  password: string;
  accountType: Designation;
  accountId: string;
  createdAt: Date;
}

export enum Designation {
  Principal = "Principal",
  Admin = "Admin",
  Head = "Head",
  Clerk = "Clerk",
  Teacher = "Teacher",
  Worker = "Worker"
}