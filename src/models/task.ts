import { model } from 'mongoose';
import { TaskSchema } from '../schemas/task';

export const Task = model('Task', TaskSchema);
