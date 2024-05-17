import  express from 'express';
import { Createblog, LoginUser, Showblog, deletePost, signupUser, uploadImages } from '../controllers/controllers.js';
import upload from '../middleware/Multer.js';

const userRouter = express.Router();

userRouter.post("/signup", signupUser);


userRouter.post("/login",LoginUser);

userRouter.post('/upload', upload.single('image'), uploadImages);

userRouter.get('/blog',Createblog);

userRouter.get('/categories/:id',Showblog);

userRouter.get('/delete/_id', deletePost);

export default userRouter;