import express, { NextFunction, Request, Response } from "express";
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import cors from 'cors';
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from 'crypto';
import { Brain, ContentModel, Link, SavedPosts, User } from "./db";
import { authMiddleware } from "./middleware";
import cookieParser from "cookie-parser";
import { any, z } from "zod";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({ origin: "https://brain-vault-eight.vercel.app", credentials: true }));


mongoose.connect(process.env.MONGO_URL!)
  .then(() => console.log("Connected to mongo DB"))
  .catch((err:any) => console.log(err));

app.listen(3000, () => console.log("Listening on PORT 3000"));

// User Signup
app.post('/api/v1/signup', async (req: Request, res: Response): Promise<any> => {
  try {
    const userSchema = z.object({
      username: z.string().min(3, 'Username should be at least 3 characters'),
      password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[a-z]/, 'Password must contain a lowercase letter')
        .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    });

    const userData = userSchema.safeParse(req.body);
    if (!userData.success) {
      return res.status(411).json({ error: userData.error });
    }

    const { username, password } = userData.data;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(403).json({ message: "User already exists" });
    }

    const hashedPass = await bcrypt.hash(password, 12);
    const newUser = await User.create({ username, password: hashedPass });
    const newBrain = await Brain.create({ userId: newUser._id });

    res.status(200).json({ message: "New user created" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// User Login
app.post("/api/v1/login", async (req: Request, res: Response): Promise<any> => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(411).json({ message: "Inputs missing" });

    const user = await User.findOne({ username });
    if (!user) return res.status(403).json({ message: "User not found" });

    const isCorrect = await bcrypt.compare(password, user.password!);
    if (!isCorrect) return res.status(403).json({ message: "Password incorrect" });

    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET!, { expiresIn: "24h" });
    res.cookie('token', token, { httpOnly: true, secure: true });
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// User Logout
app.post('/api/v1/logout', authMiddleware, async (req: Request, res: Response) => {
  try {
    res.clearCookie('token', { httpOnly: true, secure: true });
    res.status(200).json({ message: "Logged out" });
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.patch('/api/v1/profile/edit', authMiddleware, async (req: Request, res: Response): Promise<any> => {
  try {
    const { username, password } = req.body;
    //@ts-ignore
    const user = req.user;

    if (username) user.username = username;
    if (password) user.password = await bcrypt.hash(password, 12);

    await user.save();
    res.status(200).json({ success: true});
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

app.get('/api/v1/user/checkAuth', authMiddleware, async (req: Request, res: Response) => {
  try {
    //@ts-ignore
    if (req.user) {
      //@ts-ignore
      res.status(200).json({ message: "user is authorized", user: req.user });
    }
  } catch (error) {
    console.log("error while checkauth", error);
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
});

app.post('/api/v1/content/add', authMiddleware, async (req: Request, res: Response): Promise<any> => {
  try {
    const { title, link, type, tags } = req.body;
    if (!title || !link) return res.status(400).json({ message: "Required parameters missing" });

    //@ts-ignore
    const userId = req.user._id;
    let finalLink = "";
    if (type === "youtube") {
      finalLink = link.replace("watch?v=", "embed/");
    } else if (type === "twitter") {
      finalLink = link.replace('x', 'twitter');
    }

    const newContent = await ContentModel.create({
      title,
      link: finalLink,
      type: type.toLowerCase(),
      tags: tags || [],
      userId,
    });

    const brain = await Brain.findOneAndUpdate(
      { userId },
      { $push: { content: newContent._id } },
      { new: true }
    );

    res.status(200).json({ success: true, message: "Content added", newContent, brain });
  } catch (error) {
    res.status(500).json({ error });
    console.log(error);
  }
});

// View Content
app.get('/api/v1/content/view', authMiddleware, async (req: Request, res: Response) => {
  try {
    //@ts-ignore
    const content = await ContentModel.find({ userId: req.user._id }).populate("userId", "username");
    res.status(200).json({ success: true, content });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// Update Content
app.patch('/api/v1/content/update/:id', authMiddleware, async (req: Request, res: Response): Promise<any> => {
  try {
    const contentId = req.params.id;
    const { title, link, tags } = req.body;

    const updatedContent = await ContentModel.findById(contentId);
    if (!updatedContent) return res.status(404).json({ message: "Content not found" });

    updatedContent.title = title || updatedContent.title;
    updatedContent.link = link || updatedContent.link;
    updatedContent.tags = tags || updatedContent.tags;
    await updatedContent.save();

    res.status(200).json({ success: true, message: "Content updated", updatedContent });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});


app.delete('/api/v1/content/delete/:id', authMiddleware, async (req: Request, res: Response): Promise<any> => {
  try {
    const contentId = req.params.id;
    const content = await ContentModel.findById(contentId);
    if (!content) return res.status(403).json({ message: "Content not found" });

    await ContentModel.deleteOne({ _id: content._id });
    res.status(200).json({ success: true, message: "Content deleted" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// Save Post
app.post('/api/v1/saved-posts', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { contentId } = req.body;
    // @ts-ignore
    const user = req.user;

    const result = await SavedPosts.updateOne(
      { userId: user._id, contentId: contentId },
      { $setOnInsert: { userId: user._id, contentId: contentId } },
      { upsert: true }
    );

    if (result.upsertedCount > 0) {
      res.status(201).json({ message: "Post saved successfully!" });
    } else {
      res.status(200).json({ message: "Post was already saved." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong." });
  }
});

// Get Saved Posts
app.get('/api/v1/saved-posts', authMiddleware, async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = req.user;
    // Get saved posts for this user
    const savedPosts = await SavedPosts.find({ userId: user._id }).populate('contentId').select('-userId');
    res.status(200).json(savedPosts);
  } catch (error) {
    res.status(400).json({ error: error });
    console.log(error);
  }
});

// Delete Saved Post
app.delete('/api/v1/saved-posts/:contentId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { contentId } = req.params;
    // @ts-ignore
    const user = req.user;
    // Delete saved post by user and content ID
    await SavedPosts.deleteOne({ userId: user._id, contentId });
    res.status(200).json({ message: 'Post unsaved' });
  } catch (error) {
    res.status(400).json({ error: error });
    console.log(error);
  }
});

// Share Brain
app.patch('/api/v1/brain/share', authMiddleware, async (req: Request, res: Response): Promise<any> => {
  try {
    const { share } = req.body;
    //@ts-ignore
    const userId = req.user._id;

    const brain = await Brain.findOne({ userId }).populate("content").select("-userId");
    if (!brain) return res.status(404).json({ error: "Brain not found" });

    if (share === false) {
      await Link.deleteOne({ userId });
      brain.share = false;
      await brain.save();
      return res.status(200).json({ message: "Link removed" });
    }

    const existingLink = await Link.findOne({ userId });
    if (existingLink) return res.status(200).json({ success: true, link: existingLink.hash });

    const hash = crypto.randomBytes(16).toString("hex");
    brain.share = true;
    await brain.save();
    await Link.create({ hash, userId });

    res.status(200).json({ success: true, link: hash });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// View Shared Brain
app.get('/api/v1/brain/:shareLink', async (req: Request, res: Response): Promise<any> => {
  try {
    const shareLinkSchema = z.object({ shareLink: z.string().min(3) });
    const result = shareLinkSchema.safeParse(req.params);
    if (!result.success) return res.status(400).json({ error: result.error });

    const { shareLink } = result.data;
    const linkRecord = await Link.findOne({ hash: shareLink });

    if (!linkRecord) return res.status(404).json({ message: "Link not found" });

    const brain = await Brain.findOne({ userId: linkRecord.userId }).populate("content");
    res.status(200).json({ success: true, brain });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});
