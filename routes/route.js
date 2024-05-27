import  express from 'express';
import { Createblog, LoginUser, Showblog, deletePost, signupUser, updatepost, uploadImages } from '../controllers/controllers.js';
import upload from '../middleware/Multer.js';

const userRouter = express.Router();

userRouter.post("/signup", signupUser);


userRouter.post("/login",LoginUser);

userRouter.post('/upload', upload.single('image'), uploadImages); // upload

userRouter.get('/blog',Createblog); 

userRouter.get('/categories/:id',Showblog);

userRouter.delete('/delete/:id', deletePost); 

userRouter.put('update/:id', upload.single('image'),updatepost);

export default userRouter;