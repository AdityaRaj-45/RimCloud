import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  originalName: { type: String, required: true },
  s3Key:{
    type:String,
    required:true,
  },
  mimeType: { type: String, default: "application/octet-stream" },
  size: { type: Number, required: true },
  downloads: { type: Number, default: 0 },
}, { _id: true });

const transferSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, index: true },
  type: { type: String, enum: ["file", "text"], required: true, index: true },
  status:{
    type:String,
    enum:["pending","active"],
    default:"pending",
    index:true,
  },
  text: String,
  files: { type: [fileSchema], default: [] },
  expiresAt: { type: Date, required: true , index:true},
}, { timestamps: true });

export default mongoose.model("Transfer", transferSchema);