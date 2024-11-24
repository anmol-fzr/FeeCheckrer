import * as Amqp from "amqp-ts";
import { envs } from "../utils";

const queueClient = new Amqp.Connection(envs.AMQP_URI);

queueClient.on("open_connection", () => {
	console.log("Connection to Rabbit MQ Opened");
});

const mailExchange = queueClient.declareExchange("mail-exchange", "direct", {
	durable: false,
});

queueClient.completeConfiguration().then(() => {
	console.log("Exchange and queue configuration completed");
});

export { queueClient, mailExchange };
