/**
 * Type definitions
 */

/**
 * Role types
 */
export const RoleValues = {
  User: 'user',
  System: 'system',
  Assistant: 'assistant',
} as const;

export type Role = typeof RoleValues[keyof typeof RoleValues];

/**
 * Response message interface
 */
export interface ResponseMessage {
  content: string;
  messageRole: Role;
  timestamp: Date;
}
