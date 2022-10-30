import { Job } from 'bull';
import { BadRequestError } from 'routing-controllers';
import { sendVerifySucceedEmail } from './sendConfirmCreateEmail.queue';
import { Mailer } from '../../../helper/mailer';

export async function sendConfirmCreateOrderProcessor(
  job: Job<sendVerifySucceedEmail>,
): Promise<void> {
  try {
    const { data } = job;
    const { user_email, order_id } = data;
    await Mailer.createOrder(user_email, order_id);
  } catch (e) {
    throw new BadRequestError(e.message);
  }
}
