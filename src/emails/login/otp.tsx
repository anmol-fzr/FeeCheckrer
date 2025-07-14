import {
	Body,
	Container,
	Head,
	Heading,
	Html,
	Preview,
	Section,
	Text,
	Button,
} from "@react-email/components";

interface AWSVerifyEmailProps {
	otp: number;
}

export default function LoginOtpEmail({ otp = 596853 }: AWSVerifyEmailProps) {
	return (
		<Html>
			<Head />
			<Preview>Login to Fee Checkr</Preview>
			<Body style={main}>
				<Container style={container}>
					<Section style={coverSection}>
						{/*
            <Section style={imageSection}>
              <Img
                src={`${baseUrl}/static/aws-logo.png`}
                width="75"
                height="45"
                alt="AWS's Logo"
              />
            </Section>
              */}
						<Section style={upperSection}>
							<Heading style={h1}>Login to FeeCheckr</Heading>
							<Text style={mainText}>
								We want to make sure it's really you. Please enter the following
								verification code when prompted. If you don&apos;t want to
								create an account, you can ignore this message.
							</Text>
							<Section style={verificationSection}>
								<Text style={verifyText}>Verification code</Text>

								<Text style={codeText}>{otp}</Text>
								<Text style={validityText}>
									(This code is valid for 10 minutes)
								</Text>
							</Section>
							<Text style={verifyText}>OR</Text>
							<Section style={verificationSection}>
								<Button style={button}>Click Here</Button>
							</Section>
						</Section>
					</Section>
					{/*
          <Text style={footerText}>
            This message was produced and distributed by Amazon Web Services,
            Inc., 410 Terry Ave. North, Seattle, WA 98109. © 2022, Amazon Web
            Services, Inc.. All rights reserved. AWS is a registered trademark
            of{" "}
            <Link href="https://amazon.com" target="_blank" style={link}>
              Amazon.com
            </Link>
            , Inc. View our{" "}
            <Link href="https://amazon.com" target="_blank" style={link}>
              privacy policy
            </Link>
            .
          </Text>
            */}
				</Container>
			</Body>
		</Html>
	);
}

const main = {
	backgroundColor: "#fff",
	color: "#212121",
};

const container = {
	padding: "20px",
	margin: "0 auto",
	backgroundColor: "#eee",
};

const h1 = {
	color: "#333",
	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	fontSize: "20px",
	fontWeight: "bold",
	marginBottom: "15px",
};

const text = {
	color: "#333",
	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	fontSize: "14px",
	margin: "24px 0",
};

const coverSection = { backgroundColor: "#fff" };

const upperSection = { padding: "25px 35px" };

const verifyText = {
	...text,
	margin: 0,
	fontWeight: "bold",
	textAlign: "center" as const,
};

const codeText = {
	...text,
	fontWeight: "bold",
	fontSize: "36px",
	margin: "10px 0",
	textAlign: "center" as const,
};

const validityText = {
	...text,
	margin: "0px",
	textAlign: "center" as const,
};

const verificationSection = {
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
};

const mainText = { ...text, marginBottom: "14px" };

const button = {
	backgroundColor: "#5e6ad2",
	borderRadius: "3px",
	fontWeight: "600",
	color: "#fff",
	fontSize: "15px",
	textDecoration: "none",
	textAlign: "center" as const,
	display: "block",
	padding: "11px 23px",
};
