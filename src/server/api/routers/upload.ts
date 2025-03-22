 import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { Storage } from "@google-cloud/storage";
import { randomUUID } from "crypto";

if (
  !process.env.GCP_PROJECT_ID ||
  !process.env.GCP_SERVICE_ACCOUNT_KEY_PATH ||
  !process.env.GCP_BUCKET_NAME
) {
  throw new Error("Missing required Google Cloud environment variables");
}

const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  keyFilename: process.env.GCP_SERVICE_ACCOUNT_KEY_PATH,
});

const bucket = storage.bucket(process.env.GCP_BUCKET_NAME);

console.log(`Using bucket: ${bucket.name}`);

export const uploadRouter = createTRPCRouter({
  getUploadUrl: publicProcedure
    .input(
      z.object({
        filename: z.string().min(1),
        contentType: z.string().regex(
          /^(image\/|application\/(pdf|msword|vnd.openxmlformats-officedocument.wordprocessingml.document))/
        )
      })
    )
    .mutation(async ({ input }) => {
      const { filename, contentType } = input;
      const extension = filename.split(".").pop() ?? "bin";
      const objectName = `uploads/${randomUUID()}.${extension}`;
      const file = bucket.file(objectName);

      try {
        const uploadURL = await file.getSignedUrl({
          version: "v4",
          action: "write",
          expires: Date.now() + 15 * 60 * 1000, // 15 minutes
          contentType,
        });
        console.log(uploadURL)

        await file.makePublic().catch((err) => {
          console.error("Warning: Could not make file public yet:", err);
        });

        return {
          url: uploadURL[0],
          objectName,
          publicUrl: `https://storage.googleapis.com/${bucket.name}/${objectName}`,
        };
      } catch (error) {
        console.error("Error generating signed URL:", error);
        throw new Error("Unable to generate upload URL");
      }
    }),
});
