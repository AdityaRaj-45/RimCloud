import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 5000),

  origins: (process.env.CLIENT_URL || "http://localhost:5173")
    .split(",")
    .map((value) => value.trim()),

  apiUrl: (process.env.PUBLIC_API_URL || "http://localhost:5000")
    .replace(/\/$/, ""),

  ttlHours: Number(process.env.TRANSFER_TTL_HOURS || 1),

  maxFileSizeMb: Number(process.env.MAX_FILE_SIZE_MB || 100),
  awsRegion:process.env.AWS_REGION||"ap-south-1",
  awsAccessKeyId:process.env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey:process.env.AWS_SECRET_ACCESS_KEY,
  awsBucket:process.env.AWS_S3_BUCKET,
};
const requiredAwsKeys=["awsAccessKeyId","awsSecretAccessKey","awsBucket"];
for(const key of requiredAwsKeys){
  if(!env[key]){
    console.warn(`[Warning] Missing Enviroment variable for ${key}.S3 Operations will fail`);
  }
}
