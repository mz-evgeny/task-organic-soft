import mongoose from 'mongoose';

export const db = {
  connect: async () =>
    await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/organic-soft',
    ),
  disconnect: async () => await mongoose.connection.close(),
};
