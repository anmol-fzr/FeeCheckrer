import { minioClient } from "../config";

type UploadFeeReceipt = {
  studentId: string;
  feeId: string;
  file: File;
};

async function uploadFeeReceipt({ studentId, feeId, file }: UploadFeeReceipt) {
  const arr = await file.arrayBuffer();

  const res = await minioClient.putObject(
    `students`,
    `${studentId}/${feeId}`,
    Buffer.from(arr),
    undefined,
    {
      "Content-Type": "application/pdf",
    },
  );

  return res;
}

export { uploadFeeReceipt };
