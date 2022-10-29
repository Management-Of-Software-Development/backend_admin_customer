/* eslint-disable consistent-return */
import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import path from 'path';
import { readFileSync } from 'fs';
import { Types } from 'mongoose';
import { OrderModel } from '../order/order.model';
import { getOrderEmail } from './htmlTemplateGenerators/htmlEmail.generator';

class Mailer {
  private static baseUrl = `${path.resolve('mailTemplates')}/customer`;
  private static readonly host = process.env.MAIL_HOST as string;

  private static readonly port = process.env.MAIL_PORT as string;

  private static readonly user = process.env.MAIL_USER as string;

  private static readonly password = process.env.MAIL_PASS as string;

  public static async resetPassword(
    receiver: string,
    name: string,
    active_token: string,
  ) {
    const filePath = `${this.baseUrl}/resetPasswordTemplate.html`;
    const source = readFileSync(filePath, 'utf-8').toString();
    const template = handlebars.compile(source);
    const replacements = {
      user_name: `${name}`,
      user_email: `${receiver}`,
      verify_token_site: `${process.env.WEBSITE_DOMAIN_PATH}/user/forgot-password/verify/${active_token}`,
    };
    const htmlToSend = template(replacements);
    const transporter = nodemailer.createTransport({
      host: Mailer.host,
      port: parseInt(Mailer.port, 10),
      secure: false,
      auth: {
        user: Mailer.user,
        pass: Mailer.password,
      },
    });
    const option = {
      from: `"Candle In The Wind Shop" <${Mailer.user}>`,
      to: receiver,
      subject: 'Reset Account Password',
      html: htmlToSend,
    };
    await transporter.sendMail(option);
  }

  public static async registerConfirmation(
    receiver: string,
    name: string,
    active_token: string,
  ) {
    const filePath = `${this.baseUrl}/registerTemplate.html`;
    const source = readFileSync(filePath, 'utf-8').toString();
    const template = handlebars.compile(source);
    const replacements = {
      user_name: `${name}`,
      user_email: `${receiver}`,
      verify_token_site: active_token,
    };
    const htmlToSend = template(replacements);
    const transporter = nodemailer.createTransport({
      host: Mailer.host,
      port: parseInt(Mailer.port, 10),
      secure: false,
      auth: {
        user: Mailer.user,
        pass: Mailer.password,
      },
    });
    const option = {
      from: `"Candle In The Wind Shop" <${Mailer.user}>`,
      to: receiver,
      subject: 'Activate Account',
      html: htmlToSend,
    };
    try {
      await transporter.sendMail(option);
    } catch (err) {
      console.log(err.message);
      console.log(err.stack);
    }
  }

  public static async verifySucceed(receiver: string, name: string) {
    const filePath = `${this.baseUrl}/activationConfirmTemplate.html`;
    const source = readFileSync(filePath, 'utf-8').toString();
    const template = handlebars.compile(source);
    const replacements = {
      user_name: `${name}`,
      user_email: `${receiver}`,
    };
    const htmlToSend = template(replacements);
    const transporter = nodemailer.createTransport({
      host: Mailer.host,
      port: parseInt(Mailer.port, 10),
      secure: false,
      auth: {
        user: Mailer.user,
        pass: Mailer.password,
      },
    });
    const option = {
      from: `"Candle In The Wind Shop" <${Mailer.user}>`,
      to: receiver,
      subject: 'Account Verification Successfully',
      html: htmlToSend,
    };
    await transporter.sendMail(option);
  }

  public static async confirmDeliveryOrder(
    receiver: string,
    order_id: string,
  ): Promise<void> {
    const order = await OrderModel.findOne({
      _id: Types.ObjectId(order_id),
    }).lean();
    const source = getOrderEmail(order);
    const template = handlebars.compile(source);
    const htmlToSend = template({});
    const transporter = nodemailer.createTransport({
      host: Mailer.host,
      port: parseInt(Mailer.port, 10),
      secure: false,
      auth: {
        user: Mailer.user,
        pass: Mailer.password,
      },
    });
    const option = {
      from: `"Candle In The Wind Shop" <${Mailer.user}>`,
      to: receiver,
      subject: 'Confirm Order',
      html: htmlToSend,
    };
    await transporter.sendMail(option);
  }

  public static async confirmSuccessfulOrder(
    receiver: string,
    order_id: string,
  ): Promise<void> {
    const order = await OrderModel.findOne({
      _id: Types.ObjectId(order_id),
    }).lean();
    const source = getOrderEmail(order);
    const template = handlebars.compile(source);
    const htmlToSend = template({});
    const transporter = nodemailer.createTransport({
      host: Mailer.host,
      port: parseInt(Mailer.port, 10),
      secure: false,
      auth: {
        user: Mailer.user,
        pass: Mailer.password,
      },
    });
    const option = {
      from: `"Candle In The Wind Shop" <${Mailer.user}>`,
      to: receiver,
      subject: 'Confirm Successfully Delivered And Paid Order',
      html: htmlToSend,
    };
    await transporter.sendMail(option);
  }

  public static async cancelOrder(
    receiver: string,
    order_id: string,
  ): Promise<void> {
    const order = await OrderModel.findOne({
      _id: Types.ObjectId(order_id),
    }).lean();
    const source = getOrderEmail(order);
    const template = handlebars.compile(source);
    const htmlToSend = template({});
    const transporter = nodemailer.createTransport({
      host: Mailer.host,
      port: parseInt(Mailer.port, 10),
      secure: false,
      auth: {
        user: Mailer.user,
        pass: Mailer.password,
      },
    });
    const option = {
      from: `"Candle In The Wind Shop" <${Mailer.user}>`,
      to: receiver,
      subject: 'Cancel Order',
      html: htmlToSend,
    };
    await transporter.sendMail(option);
  }

  public static async createOrder(
    receiver: string,
    order_id: string,
  ): Promise<void> {
    const order = await OrderModel.findOne({
      _id: Types.ObjectId(order_id),
    }).lean();
    const source = getOrderEmail(order);
    const template = handlebars.compile(source);
    const htmlToSend = template({});
    const transporter = nodemailer.createTransport({
      host: Mailer.host,
      port: parseInt(Mailer.port, 10),
      secure: false,
      auth: {
        user: Mailer.user,
        pass: Mailer.password,
      },
    });
    const option = {
      from: `"Candle In The Wind Shop" <${Mailer.user}>`,
      to: receiver,
      subject: 'Create New Order Notification',
      html: htmlToSend,
    };
    await transporter.sendMail(option);
  }
}

export { Mailer };
