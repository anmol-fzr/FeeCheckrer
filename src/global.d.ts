declare module "bun" {
	interface Env {
		MODE?: "DEV" | "PROD";
		MONGO_URI: string;
		REDIS_HOST: string;
		REDIS_PORT: string;
		AMQP_URI: string;
		PORT: string;
		JWT_SECRET: string;
		JWT_TEMP_SECRET: string;
		MINIO_HOST: string;
		MINIO_IP: string | "localhost";
		MINIO_PORT: string;
		MINIO_ACCESS_KEY: string;
		MINIO_SECRET_KEY: string;
	}
}
