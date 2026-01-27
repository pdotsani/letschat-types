import { Role } from './types.js';

/**
 * Response message interface
 */
export interface ResponseMessage {
  content: string;
  messageRole: Role;
  timestamp?: Date;
  userId?: string;
  chatId?: string;
}