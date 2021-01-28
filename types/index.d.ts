import { JobHelpers } from 'graphile-worker';
import { SendMailOptions } from 'nodemailer';
export interface SendEmailOptions {
  theme?: string;
  email: string;
  template: string;
  variables?: Record<string, unknown>;
  extend?: SendMailOptions;
}
export type Task<P = unknown> = (
  payload: P,
  helpers: JobHelpers,
) => void | Promise<void>;

interface GlobalTest {
  TEST_EMAILS: any[];
}
