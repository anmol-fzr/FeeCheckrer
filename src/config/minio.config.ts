import * as Minio from "minio";
import { envs } from "../utils";

const { HOST, PORT, ACCESS_KEY, SECRET_KEY } = envs.MINIO;

const minioClient = new Minio.Client({
	endPoint: HOST,
	port: Number(PORT),
	useSSL: false,
	accessKey: ACCESS_KEY,
	secretKey: SECRET_KEY,
});

const baseMinioPath = `http://localhost:${PORT}`;

export { minioClient, baseMinioPath };
