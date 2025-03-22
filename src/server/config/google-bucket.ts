import { env } from "~/env";
import { Storage } from "@google-cloud/storage";
const storage = new Storage({
    keyFilename:env.GCP_SERVICE_ACCOUNT_KEY_PATH
  });
  
  export const bucket = storage.bucket(env.GCP_BUCKET_NAME);
  