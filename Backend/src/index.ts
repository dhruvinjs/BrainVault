
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
import { OAuth2Client } from "google-auth-library";
const app = express();
const GOOGLE_CLIENT_ID=process.env.GOOGLE_CLIENT_ID
const GOOGLE_SECRET=process.env.GOOGLE_SECRET
const REDIRECT_URI=`${process.env.BACKEND_URI}/api/v1/auth/google/callback`
const client=new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
app.use(express.json());
app.use(cookieParser());



app.use(cors({ origin: ["https://brain-vault-eight.vercel.app","http://localhost:5173"], credentials: true }));


mongoose.connect(process.env.MONGO_URL!)
  .then(() => console.log("Connected to mongo DB"))
  .catch((err:any) => console.log(err));

app.listen(3000, () => console.log("Listening on PORT 3000"));

const processContentLink = (link: string, type: string): string => {
  if (type === 'youtube') {
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = link.match(youtubeRegex);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    return link;
  }
  if (type === 'twitter') {
    return link.replace('//x.com', '//twitter.com');
  }
  return link;
};

//google-auth
app.post('/api/v1/auth/google',async (req:Request,res:Response) => {
  try {
    const token=req.body.token
    if(!token){
      res.status(404).json({success:false,message:"Token is required"})
      
    }
    const ticket=await client.verifyIdToken({
      idToken:token,
      audience:GOOGLE_CLIENT_ID
    })

    const payload=ticket.getPayload()
    if (!payload) {
      res.status(401).json({ message: "Invalid Google token" });
      return
    }
    const { email, sub: googleId, name } = payload

     let user = await User.findOne({ googleId });

    if (!user) {
      const baseUsername =
        email?.split("@")[0].replace(/\W+/g, "").toLowerCase() ||
        (name || '').replace(/\s+/g, "").toLowerCase();

      let username = baseUsername;
      let count = 1;

      while (await User.findOne({ username })) {
        username = `${baseUsername}${count++}`; // john → john1 → john2 ...
      }

      user = await User.create({
        username,
        email,
        googleId,
        password: null,
      });
    }
       const jwtToken = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET!, { expiresIn: "24h" });
   
      
      res.cookie('token', jwtToken,{
        httpOnly:true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      });

     res.status(200).json({ message: "Google Registration successful",success:true });
      return

  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({ message: "Google authentication failed"});
  }
})


app.post('/api/v1/auth/google/login',async (req:Request,res:Response) => {
  try {
    const token=req.body.token
    if(!token){
      res.status(404).json({message:"Token is required"})
      return
    }
    const client=new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
    const ticket=await client.verifyIdToken({
      idToken:token,
      audience:process.env.GOOGLE_CLIENT_ID
    })
    const payload=ticket.getPayload()
     if (!payload) {
       res.status(401).json({ message: "Invalid Google token" });
       return
    }
    const { sub: googleId } = payload;
   const user = await User.findOne({ googleId });
    if (!user) {
      res.status(404).json({ message: "User not registered with Google" });
      return
    }
      const jwtToken = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET!, { expiresIn: "24h" });

    // Set cookie (same as registration)
    res.cookie('token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    res.status(200).json({ message: "Google login successful", success: true });



  } catch (error) {
     console.error("Google login error:", error);
    res.status(500).json({ message: "Google authentication failed",});
  }
})


app.post('/api/v1/register', async (req: Request, res: Response) => {
  try {
    const userSchema = z.object({
      username: z.string().min(3, 'Username should be at least 3 characters'),
      email:z.string().email("Invalid Email address"),
      password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[a-z]/, 'Password must contain a lowercase letter')
        .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    });

    const userData = userSchema.safeParse(req.body);
    if (!userData.success) {
      res.status(411).json({ error: userData.error });
      return
    }

    const { username,email, password } = userData.data;
     const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });
    if (existingUser) {
      res.status(403).json({
        message: existingUser.username === username
          ? "Username already exists"
          : "Email already exists"
      });
      return
    }

    const hashedPass = await bcrypt.hash(password, 12);
    const newUser = await User.create({ username,email, password: hashedPass });
    await Brain.create({ userId: newUser._id });
    const token = jwt.sign({ _id: newUser._id }, process.env.TOKEN_SECRET!, { expiresIn: "24h" });
    res.cookie('token', token, { httpOnly: true, secure: true,sameSite:"none" });
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
    res.cookie('token', token, { httpOnly: true, secure: true,sameSite:"none" });
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

app.get('/api/v1/user/profile', authMiddleware, async (req: Request, res: Response):Promise<any> => {
  try {
    //@ts-ignore
    const userId = req.user._id;

    // Fetch user data
    const user = await User.findById(userId).select('-password'); // exclude password

    if (!user) return res.status(404).json({ message: "User not found" });

    // Fetch user's content
    const content = await ContentModel.find({ userId }).populate('userId', 'username');

    res.status(200).json({ success: true, user, content });
  } catch (error) {
    console.error("Error fetching profile:", error);
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
    
    // Return the updated user object
    res.status(200).json({ 
      success: true, 
      user: { _id: user._id, username: user.username } 
    });
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
    if (!title) {
        return res.status(400).json({ message: "Title parameter is required" });
    }
    // A link is not required for a 'note'
    if (!link && type !== 'note') {
        return res.status(400).json({ message: "Link parameter is required for this content type" });
    }

    //@ts-ignore
    const userId = req.user._id;
    
    // Use the new robust link processing function
    const finalLink = processContentLink(link, type);

    const newContent = await ContentModel.create({
      title,
      link: finalLink,
      type: type.toLowerCase(),
      tags: tags || [],
      userId,
    });

    await Brain.findOneAndUpdate(
      { userId },
      { $push: { content: newContent._id } },
      { new: true }
    );

    res.status(200).json({ success: true, message: "Content added", newContent });
  } catch (error) {
    res.status(500).json({ error });
    console.log(error);
  }
});

app.get('/api/v1/content/view', authMiddleware, async (req: Request, res: Response) => {
  try {
    //@ts-ignore
    const content = await ContentModel.find({ userId: req.user._id }).populate("userId", "username");
    res.status(200).json({ success: true, content });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});


app.patch('/api/v1/content/update/:id', authMiddleware, async (req: Request, res: Response): Promise<any> => {
  try {
    const contentId = req.params.id;
    const { title, link, tags } = req.body;
    //@ts-ignore
    const userId = req.user._id;

    const contentToUpdate = await ContentModel.findOne({ _id: contentId, userId: userId });
    if (!contentToUpdate) return res.status(404).json({ message: "Content not found or you do not have permission to update it." });

    if (title) contentToUpdate.title = title;
    if (tags) contentToUpdate.tags = tags;
    
    // Also process the link on update, using the content's original type
    if (link) {
        contentToUpdate.link = processContentLink(link, contentToUpdate.type);
    }

    await contentToUpdate.save();

    res.status(200).json({ success: true, message: "Content updated", updatedContent: contentToUpdate });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});


app.delete('/api/v1/content/delete/:id', authMiddleware, async (req: Request, res: Response): Promise<any> => {
  try {
    const contentId = req.params.id;
    //@ts-ignore
    const userId = req.user._id;

    const result = await ContentModel.deleteOne({ _id: contentId, userId: userId });

    if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Content not found or you do not have permission to delete it." });
    }

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
app.patch('/api/v1/brain/share', authMiddleware, async (req: Request, res: Response):Promise<any> => {
  try {
    const { share } = req.body;
    //@ts-ignore
    const userId = req.user._id;

    const brain = await Brain.findOne({ userId }).populate("content").select("-userId");
    if (!brain) {
      res.status(404).json({ error: "Brain not found" });
      return 
}
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
    return
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// View Shared Brain
app.get('/api/v1/brain/:shareLink', async (req: Request, res: Response):Promise<any> => {
  try {
    // Validate the shareLink param
    const shareLinkSchema = z.object({ shareLink: z.string().min(3) });
    const result = shareLinkSchema.safeParse(req.params);
    if (!result.success) return res.status(400).json({ error: result.error.format() });

    const { shareLink } = result.data;

    // Find the link record
    const linkRecord = await Link.findOne({ hash: shareLink });
    if (!linkRecord) return res.status(404).json({ message: "Link not found" });

    // Find brain and populate content
    const brain = await Brain.findOne({ userId: linkRecord.userId }).populate('content');
    if (!brain) return res.status(404).json({ message: "Brain not found" });

    res.status(200).json({ success: true, brain });
  } catch (error) {
    console.error("Error fetching shared brain:", error);
    res.status(500).json({ error });
  }
});


// Get User Profile with Content
