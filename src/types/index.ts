/**
 * Type definitions
 */

/**
 * Role types
 */
export enum Role {
  User = 'user',
  System = 'system',
  Assistant = 'assistant',
}

/**
 * Response message interface
 */
export interface ResponseMessage {
  content: string;
  messageRole: Role;
  timestamp: Date;
}
