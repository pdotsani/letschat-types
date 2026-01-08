/**
 * Type definitions
 */

/**
 * Role types
 */
export const Role = {
  User: 'user',
  System: 'system',
  Assistant: 'assistant',
} as const;

export type Role = typeof Role[keyof typeof Role];

/**
 * Response message interface
 */
export interface ResponseMessage {
  content: string;
  messageRole: Role;
  timestamp: Date;
}
