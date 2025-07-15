import nodemailer from "nodemailer";
import { envs } from "../utils";

const { ADDRESS, PASS } = envs.GMAIL;

const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 587,
	secure: false,
	auth: {
		user: ADDRESS,
		pass: PASS,
	},
});

export { transporter as mailTransporter };
