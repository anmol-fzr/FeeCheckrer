import { envs } from "@/utils";
import { minioClient } from "../config";

type GetFeeReceiptPath = {
	studentId: string;
	feeId: string;
};

type GetFeeReceiptUri = GetFeeReceiptPath;
type UploadFeeReceipt = GetFeeReceiptPath & {
	file: File;
};

function getFeeReceiptPath({ studentId, feeId }: GetFeeReceiptPath) {
	return `${studentId}/${feeId}`;
}

async function uploadFeeReceipt({ studentId, feeId, file }: UploadFeeReceipt) {
	const arr = await file.arrayBuffer();

	const path = getFeeReceiptPath({ studentId, feeId });

	const res = await minioClient.putObject(
		`students`,
		path,
		Buffer.from(arr),
		undefined,
		{
			"Content-Type": "application/pdf",
		},
	);

	return res;
}

async function getFeeReceiptUri({ studentId, feeId }: GetFeeReceiptUri) {
	const path = getFeeReceiptPath({ studentId, feeId });

	const presignedUrl = await minioClient.presignedUrl("GET", "students", path);
	const pdfUri = resolveMinioHost(presignedUrl);

	const url = new URL(pdfUri);
	const newUrl = url.origin + url.pathname;

	return newUrl;
}

export { uploadFeeReceipt, getFeeReceiptUri };

function resolveMinioHost(uri: string) {
	return uri.replace(envs.MINIO.HOST, envs.MINIO.IP);
}
