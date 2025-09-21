import type { User } from "./User";

export interface Comment {
  id: number;
  userId: number;
  trackId?: number;
  comment: string;
  createdAt: string;
  user: User;
}
