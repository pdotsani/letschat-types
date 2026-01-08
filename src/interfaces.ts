import { Role } from './types';

/**
 * Response message interface
 */
export interface ResponseMessage {
  content: string;
  messageRole: Role;
  timestamp: Date;
}