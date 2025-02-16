import { Document } from 'mongoose';

export enum TASK_STATUS {
  NEW = 'NEW',
  PROCESSING = 'PROCESSING',
  DONE = 'DONE',
  ERROR = 'ERROR',
}

export interface Task extends Document {
  url: string;
  status: keyof typeof TASK_STATUS;
  http_code?: number;
}
