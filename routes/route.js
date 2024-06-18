import express from 'express';
import { Createblog, LoginUser, Showblog, deletePost, signupUser, uploadImages, updateBlog, getComments, createComment, updateComment, deleteComment } from '../controllers/controllers.js';
import upload from '../middleware/Multer.js';
import authenticateUser from '../middleware/authenticate.js';

const userRouter = express.Router();

userRouter.post("/signup", signupUser);


userRouter.post("/login", LoginUser);

userRouter.post('/upload', upload.single('image'), uploadImages);

userRouter.get('/blog',authenticateUser, Createblog);

userRouter.get('/categories/:id', Showblog);

userRouter.delete('/delete/:id',authenticateUser, deletePost);

userRouter.put('/update/:id',authenticateUser, upload.single('image'), updateBlog);

userRouter.get('/comments1', getComments);

userRouter.post('/comments', createComment);

userRouter.put('/comments/:d', updateComment);

userRouter.delete('/comments/delete/:id', deleteComment);

export default userRouter;