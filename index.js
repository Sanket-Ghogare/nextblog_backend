import  mongoose from 'mongoose';
import  express from 'express';
import  cors from 'cors';
import  userRouter from './routes/route.js'; 
const app = express();
const port =5000;


mongoose.connect('mongodb://127.0.0.1:27017/blogapp').then(()=>{
    console.log("connected to mongoDb");
}).catch((error)=>{
    console.log("Mogodb is failed to connect",error);

})
app.use(cors())
app.use(express.json())
app.use('/api',userRouter);



// app.use(express.json({ limit: '5mb' }));
// app.use(express.urlencoded({ limit: '5mb', extended: true })); 

app.listen(port, ()=>{
    console.log(`http://localhost:${port}`);
})

