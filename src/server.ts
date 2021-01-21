import './env'
import { init } from './app';

const Console = console;
export const start = async (): Promise<void> => {
  const server = await init();
  await server.start();
  Console.log(`Servidor en : ${server.info.uri}`);
};

start();
