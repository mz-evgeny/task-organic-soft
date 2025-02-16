import { Task as ITask, TASK_STATUS } from './interfaces/task';
import { Task } from './models/task';

const LIMIT = 50;

const endpoints = ['https://google.com', 'https://reddit.com'];

export const initData = async () => {
  await Task.insertMany(
    endpoints.map((url) => ({
      url,
      status: 'NEW',
    })),
  );
};

export const handleTasks = async (cursor?: ITask['_id']) => {
  const tasks = await Task.find(
    {
      ...(cursor ? { _id: { $lt: cursor } } : {}),
      status: TASK_STATUS.NEW,
    },
    null,
    { limit: LIMIT, lean: true, sort: { _id: -1 } },
  );

  if (tasks.length === 0) {
    return;
  }

  const ids = tasks.map(({ _id }) => _id);

  const preparedTasks = await Task.updateMany(
    {
      _id: { $in: ids },
      status: TASK_STATUS.NEW,
    },
    { $set: { status: TASK_STATUS.PROCESSING } },
  );

  if (preparedTasks.modifiedCount === 0) {
    return;
  }

  handlePartOfTasks(ids);

  const lastTasks = tasks[tasks.length - 1];

  handleTasks(lastTasks._id);
};

const handlePartOfTasks = (ids: ITask['_id']) => {
  (async () => {
    try {
      const tasks = await Task.find({ _id: { $in: ids } }).lean();
      await Promise.all(tasks.map(handleTask));

      console.log('✅ Part of reauests have been done');
    } catch (error) {
      console.error('Background processing error:', error);
    }
  })();
};

const handleTask = async ({ url, _id }: ITask) => {
  try {
    const { status, ok } = await fetch(url);

    if (ok) {
      await updateTask({
        id: _id,
        status: TASK_STATUS.DONE,
        httpCode: status,
      });
    } else {
      await updateTask({
        id: _id,
        status: TASK_STATUS.ERROR,
        httpCode: status,
      });
    }
  } catch (error) {
    await updateTask({
      id: _id,
      status: TASK_STATUS.ERROR,
      httpCode: error.response?.status || 500,
    });
  }
};

const updateTask = async ({
  id,
  status,
  httpCode,
}: {
  id: ITask['_id'];
  status: ITask['status'];
  httpCode: number;
}) => {
  await Task.updateOne(
    { _id: id },
    {
      $set: {
        status: status,
        http_code: httpCode,
      },
    },
  );
};
