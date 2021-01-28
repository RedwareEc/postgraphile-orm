import './env';
import { init } from './app';

export const start = async (): Promise<void> => {
  const server = await init();
  await server.start();
};

start();
