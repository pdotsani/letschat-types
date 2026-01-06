export const Role = {
  User: 'user',
  System: 'system',
} as const;

export type Role = typeof Role[keyof typeof Role];

export interface ResponseMessage {
  content: string;
  messageRole: Role;
  timestamp: Date;
}
