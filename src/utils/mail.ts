import { mailTransporter } from "@/config";
import { LoginOtpEmail } from "@/emails";
import { render } from "@react-email/components";
import { envs } from "@/utils";

type MailData = {
	email: string;
	otp: number;
};

const sendMail = async ({ email, otp }: MailData) => {
	const html = await render(LoginOtpEmail({ otp }));

	mailTransporter
		.sendMail({
			from: `FeeCheckr ${envs.GMAIL}`,
			to: [email],
			subject: `Login to FeeCheckr`,
			html,
		})
		.then((res) => {
			console.log(res.response);
		});
};

export { sendMail };
