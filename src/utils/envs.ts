const env = process.env;

const envs = Object.freeze({
	isDev: env.MODE === "DEV",

	AMQP_URI: env.AMQP_URI,
	JWT_SECRET: env.JWT_SECRET,
	PORT: env.PORT ?? 3000,
	MONGO_URI: env.MONGO_URI,

	APP_URI: Object.freeze({
		ADMIN: env.ADMIN_URI,
		STUDENT: env.STUDENT_URI,
	}),

	MINIO: Object.freeze({
		HOST: env.MINIO_HOST,
		PORT: env.MINIO_PORT,
		ACCESS_KEY: env.MINIO_ACCESS_KEY,
		SECRET_KEY: env.MINIO_SECRET_KEY,
	}),

	SA: Object.freeze({
		NAME: env.SUPERADMIN_NAME,
		MOBILE: env.SUPERADMIN_MOBILE,
		EMAIL: env.SUPERADMIN_EMAIL,
		PASSWORD: env.SUPERADMIN_PASSWORD,
	}),
});

export { envs };
