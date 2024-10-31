import * as Amqp from "amqp-ts";

const queueClient = new Amqp.Connection("amqp://rabbitmq");

queueClient.on("open_connection", () => {
  console.log("Connection to Rabbit MQ Opened");
});

const mailExchange = queueClient.declareExchange(
  "mail-exchange",
  "direct",
  { durable: false },
);

queueClient.completeConfiguration().then(() => {
  console.log("Exchange and queue configuration completed");
});

export { queueClient, mailExchange };
