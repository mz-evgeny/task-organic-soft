import { db } from './db';
import { handleTasks, initData } from './utils';

console.log(`🚀 App is ready`);

const start = async () => {
  await db.connect();

  await initData();

  await handleTasks();
};

start().catch((error) => console.log('⛔ Critical error:', error));
