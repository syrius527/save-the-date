import "server-only";
import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

let cached: S3Client | null = null;

export function r2Configured(): boolean {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET &&
      process.env.NEXT_PUBLIC_MEDIA_HOST,
  );
}

function client(): S3Client {
  if (!cached) {
    cached = new S3Client({
      region: "auto",
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
      // AWS SDK ≥3.729는 CRC32 체크섬 헤더를 기본 전송하는데 R2가 거부함
      requestChecksumCalculation: "WHEN_REQUIRED",
      responseChecksumValidation: "WHEN_REQUIRED",
    });
  }
  return cached;
}

// ContentType/ContentLength를 서명에 포함 → R2가 선언값과 다른 업로드를 거부
export async function presignPut(opts: {
  key: string;
  contentType: string;
  contentLength: number;
}): Promise<string> {
  return getSignedUrl(
    client(),
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET!,
      Key: opts.key,
      ContentType: opts.contentType,
      ContentLength: opts.contentLength,
    }),
    { expiresIn: 600 },
  );
}

export async function headObject(
  key: string,
): Promise<{ size: number; contentType: string } | null> {
  try {
    const res = await client().send(
      new HeadObjectCommand({ Bucket: process.env.R2_BUCKET!, Key: key }),
    );
    return {
      size: res.ContentLength ?? 0,
      contentType: res.ContentType ?? "",
    };
  } catch {
    return null;
  }
}

export async function deleteObjects(keys: string[]): Promise<void> {
  for (let i = 0; i < keys.length; i += 1000) {
    const chunk = keys.slice(i, i + 1000);
    await client().send(
      new DeleteObjectsCommand({
        Bucket: process.env.R2_BUCKET!,
        Delete: { Objects: chunk.map((Key) => ({ Key })), Quiet: true },
      }),
    );
  }
}

export function publicUrl(key: string): string {
  return `https://${process.env.NEXT_PUBLIC_MEDIA_HOST}/${key}`;
}
