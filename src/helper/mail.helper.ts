import { mailExchange } from "../config";
import * as Amqp from "amqp-ts";

type MailQueueData = {
  email: string;
  type: "login-otp";
  otp: number;
};

const publishOnMailQueue = (data: MailQueueData) => {
  console.log("publishOnMailQueue");

  const msg = new Amqp.Message(Buffer.from(JSON.stringify(data)));
  mailExchange.send(msg, "mail-queue");
};

export { publishOnMailQueue };
export type { MailQueueData };
