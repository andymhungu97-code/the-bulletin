import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  content: { type: String, required: true },
  images: [{ type: String }] // array of image paths
}, { timestamps: true });

export default mongoose.model("Post", postSchema);