import express from 'express';
import { Createblog, LoginUser, Showblog, deletePost, signupUser, uploadImages, updateBlog, getComments, createComment, updateComment, deleteComment, categoriesSerching } from '../controllers/controllers.js';
import upload from '../middleware/Multer.js';
import authenticateUser from '../middleware/authenticate.js';

const userRouter = express.Router();

userRouter.post("/signup", signupUser);


userRouter.post("/login", LoginUser);

userRouter.post('/upload', upload.single('image'), uploadImages);

userRouter.get('/blog', Createblog);

userRouter.get('/categories/:id', Showblog);

userRouter.delete('/delete/:id', deletePost);

userRouter.put('/update/:id', upload.single('image'), updateBlog);

userRouter.get('/comments1', getComments);

userRouter.post('/comments', createComment);

userRouter.put('/comments/:id', updateComment);

userRouter.delete('/comments/delete/:id', deleteComment);

userRouter.get('/searchcategory/:category', categoriesSerching);



export default userRouter;