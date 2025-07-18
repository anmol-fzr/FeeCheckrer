declare module "bun" {
	interface Env {
		MODE?: "DEV" | "PROD";
		ADMIN_URI: string;
		STUDENT_URI: string;
		MONGO_URI: string;
		AMQP_URI: string;
		PORT: string;
		JWT_SECRET: string;
		MINIO_HOST: string | "localhost";
		MINIO_PORT: string;
		MINIO_ACCESS_KEY: string;
		MINIO_SECRET_KEY: string;
		SUPERADMIN_NAME: string;
		SUPERADMIN_MOBILE: number;
		SUPERADMIN_EMAIL: string;
		SUPERADMIN_PASSWORD: string;
		GMAIL_ADDR: string;
		GMAIL_PASS: string;
	}
}

