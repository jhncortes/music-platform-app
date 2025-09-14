import axiosClient from "../axios";

export async function putToS3(presignedUrl: string, file: File) {
  try {
    const s3Response = await axiosClient.put(presignedUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
      withCredentials: false,
    });
    console.log("File uploaded to S3 successfully", s3Response);
  } catch (error) {
    console.error("Error uploading file to S3:", error);
  }
}

export default { putToS3 };
