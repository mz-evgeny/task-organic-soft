import * as mongoose from 'mongoose';
import { Task, TASK_STATUS } from '../interfaces/task';

export const TaskSchema = new mongoose.Schema<Task>({
  url: { type: String, required: true },
  status: { type: String, enum: TASK_STATUS, default: TASK_STATUS.NEW },
  http_code: Number,
});
