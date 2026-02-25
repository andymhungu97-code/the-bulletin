import express from "express";
import multer from "multer";
import path from "path";
import Post from "../models/Post.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* =========================
   MULTER CONFIGURATION
========================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

/* =========================
   GET ALL POSTS
========================= */

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   GET SINGLE POST
========================= */

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   CREATE POST (WITH MULTIPLE IMAGES)
========================= */

router.post("/", verifyToken, upload.array("images", 10), async (req, res) => {
  try {
    const { title, category, content } = req.body;

    const imagePaths = req.files && req.files.length > 0
      ? req.files.map(file => `/uploads/${file.filename}`)
      : [];

    const newPost = new Post({
      title,
      category,
      content,
      images: imagePaths
    });

    await newPost.save();

    res.status(201).json(newPost);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   DELETE POST
========================= */

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   EXPORT
========================= */

export default router;