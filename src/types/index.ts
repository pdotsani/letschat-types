/**
 * Type definitions
 */


/**
 * Role types
 */
export const RoleTypes = {
  User: 'user',
  System: 'system',
  Assistant: 'assistant',
} as const;

export type Role = typeof RoleTypes[keyof typeof RoleTypes];
