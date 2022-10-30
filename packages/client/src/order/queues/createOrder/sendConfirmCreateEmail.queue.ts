import Bull, { Queue } from 'bull';
import { sendConfirmCreateOrderProcessor } from './sendConfirmCreateEmail.processor';

export type sendVerifySucceedEmail = {
  user_email: string;
  order_id: string;
};

export const sendConfirmCreateOrderEmailQueue: Queue<sendVerifySucceedEmail> = new Bull(
  'send-confirm-create-order-email',
  {
    redis: {
      port: Number.parseInt(process.env.REDIS_PORT, 10),
      host: process.env.REDIS_HOST,
    },
  },
);

sendConfirmCreateOrderEmailQueue.process(sendConfirmCreateOrderProcessor);
