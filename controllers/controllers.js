
import User from '../models/userSchema.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import uploadOnCloudnary from '../utils/Cloudinary.js';
import Blog from '../models/blogSchema.js';
import Comments from '../models/comments.js';

const ACCESS_SECRET_KEY = process.env.ACCESS_SECRET_KEY;
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;

export const signupUser = async (req, res) => {

  const { username, email, password } = req.body;
  const hashpassword = bcrypt.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashpassword });

  try {
    await newUser.save();
    res.status(201).json("User Created Successfully");
  } catch (error) {
    res.status(500).json("Something went wrong");
  }

}

export const LoginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }


  try {

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json("Username does not match")
    }
    const match = await bcrypt.compareSync(password, user.password);
    if (match) {
      // if (!ACCESS_SECRET_KEY || !REFRESH_SECRET_KEY) {
      //     throw new Error('Secret keys are not defined');
      // }
      const accessToken = jwt.sign(user.toJSON(), ACCESS_SECRET_KEY);
      const refreshToken = jwt.sign(user.toJSON(), REFRESH_SECRET_KEY);
      const isAdmin = user.isAdmin ? jwt.sign({ isAdmin: true }, JWT_SECRET) : null;

      // const newToken = new Token({})
      return res.status(200).json({
        accessToken,
        // refreshToken,
        isAdmin: isAdmin ? isAdmin : '',
        name: user.name,
        username: user.username
      });
    } else {
      return res.status(400).json({ error: "Password does not match" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Something went wrong", errorMessage: error.message });
  }
}

export const uploadImages = async (req, res) => {
  try {
    if (req.file || !req.user.username) {
      return res.status(401).json({ error: "Unauthorized", errorMessage: error.message });
    }
    const loggedInUname = req.user.username;
    let fileUrl = "";

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (req.file) {
      const { path } = req.file;
      const cloudinaryResponse = await uploadOnCloudnary(path);
      fileUrl = cloudinaryResponse.url;
    } else {
      fileUrl = "https://images.unsplash.com/photo-1543128639-4cb7e6eeef1b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bGFwdG9wJTIwc2V0dXB8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80";
    }


    const newBlogPost = new Blog({
      author: loggedInUname,
      title: req.body.title,
      content: req.body.content,
      category: req.body.category,
      image: fileUrl,
    });
    await newBlogPost.save();
    res.json({ url: fileUrl });
  }
  catch (error) {
    console.error("Error while uploading image:", error);
    return res.status(500).json({ error: "Failed to upload image", errorMessage: error.message });

  }

}

export const Createblog = async (req, res) => {
  try {
    const Posts = await Blog.find();
    res.json(Posts);
  }
  catch (error) {
    res.status(500).json("Failed to fetch the posts");
  }
}

export const Showblog = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Blog.findOne({ _id: id });
    if (post) {
      res.json(post);
    }
    else {
      res.status(404).json({ error: 'not found the post id' });
    }
  } catch (error) {
    res.status(500).json({ error: "failed to fetch the post" });
  }
}

export const deletePost = async (req, res) => {
  try {
    const id = req.params.id;
    const blog = await Blog.findOneAndDelete({ _id: id });

    if (blog && blog.author === req.user.username) {
      await Blog.findByIdAndDelete({ _id: id });
      return res.json({
        sucess: "true"
      })
    }


  } catch (error) {
    res.status(500).json({ error: "failed to delete post" });

  }
}

export const updateBlog = async (req, res) => {

  try {
    const { id } = req.params;
    const updatedPost = {
      title: req.body.title,
      content: req.body.content,
    };

    if (req.file) {
      const { path } = req.file;
      const cloudinaryResponse = await uploadOnCloudnary(path);
      updatedPost.image = cloudinaryResponse.url;
    }

    const post = await Blog.findByIdAndUpdate(id, updatedPost, { new: true });

    if (!post) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    if (post.author !== req.user.username) {
      return res.status(404).json({ error: 'Unauthorized' });
    }
    return res.json(post);
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong", errorMessage: error.message });
  }
};

// Get all comments
export const getComments = async (req, res) => {
  try {
    const comments = await Comments.find();
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

// Create a new comment
export const createComment = async (req, res) => {
  try {
    const { name, postid, comments } = req.body;
    const newComment = new Comments({ name, postid, comments });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create comment' });
  }
};


// Update a comment
export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, postid, comments } = req.body;
    const updatedComment = await Comments.findByIdAndUpdate(
      id,
      { name, postid, comments },
      { new: true }
    );
    if (!updatedComment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update comment' });
  }
};

// Delete a comment
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedComment = await Comments.findByIdAndDelete(id);
    if (!deletedComment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.status(200).json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete comment' });
  }
};
