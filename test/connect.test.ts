import { Server } from '@hapi/hapi';
import { init } from '../src/app';

let server: Server;

beforeAll(async () => {
  server = await init();
  await server.start();
  return server;
});

test('content-server::ok', () => {
  expect(0).toEqual(0);
});

afterAll(async () => {
  return await server.stop();
});

// af;
// const addJob = () => Promise.resolve('ok');
