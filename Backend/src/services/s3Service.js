import {
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3 from "../config/s3.js";
import { env } from "../config/env.js";

const Bucket = env.awsBucket||process.env.AWS_S3_BUCKET;

// Generate temporary PUT upload URL (valid for 5 mins)
export async function createUploadUrl(key, mimeType) {
  const command = new PutObjectCommand({
    Bucket,
    Key: key,
    ContentType: mimeType,
  });

  return getSignedUrl(s3, command, {
    expiresIn: 300,
  });
}

// Generate temporary GET download URL (valid for 15 mins)
export async function createDownloadUrl(
  key,
  filename,
  mimeType,
  inline = false
) {
  const disposition = inline ? "inline" : "attachment";

  const command = new GetObjectCommand({
    Bucket,
    Key: key,
    ResponseContentDisposition: `${disposition}; filename*=UTF-8''${encodeURIComponent(filename)}`,
    ResponseContentType: mimeType,
  });

  return getSignedUrl(s3, command, {
    expiresIn: 900,
  });
}

// Check object metadata and verify existence via HeadObject
export async function getObjectInfo(key) {
  const command = new HeadObjectCommand({
    Bucket,
    Key: key,
  });

  return s3.send(command);
}

// Batch delete objects from S3
export async function deleteS3Objects(keys) {
  if (!keys || !keys.length) return;

  const command = new DeleteObjectsCommand({
    Bucket,
    Delete: {
      Objects: keys.map((key) => ({ Key: key })),
      Quiet: true,
    },
  });

  const result = await s3.send(command);

  if (result.Errors?.length) {
    throw new Error("Some S3 objects could not be deleted");
  }
}