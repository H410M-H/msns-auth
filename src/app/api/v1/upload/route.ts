// app/api/upload/route.ts
import { type NextRequest, NextResponse } from 'next/server';
import { Storage } from "@google-cloud/storage";
import multer from "multer";
import { Readable } from 'stream';
import { env } from '~/env';

const storage = new Storage({
  keyFilename: env.GCP_SERVICE_ACCOUNT_KEY_PATH,
});

const bucket = storage.bucket(env.GCP_BUCKET_NAME);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `uploads/${Date.now()}-${file.name}`;
    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: file.type,
    });

    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null);

    await new Promise((resolve, reject) => {
      readableStream.pipe(blobStream)
        .on('finish', resolve)
        .on('error', reject);
    });

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    return NextResponse.json({ url: publicUrl }, { status: 200 });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}

export const config = {
  runtime: 'nodejs',
};