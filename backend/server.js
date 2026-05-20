import express from 'express';
import cors from 'cors';
import {v2 as cloudinary} from 'cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';
import streamifier from 'streamifier';
const app=express();
dotenv.config();



app.use(cors(
  {
   origin :"https://file-uploder-zeta.vercel.app/",
       credentials: true
  }
));
console.log(process.env.CLOUDINARY_NAME)

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

const storage=multer.memoryStorage();
const upload=multer({storage,
    limits:{
        fileSize: 5*1024*1024
    }
})
const PORT=process.env.PORT || 5000;


app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    console.log("file is ",req.file);
    const streamUpload = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {resource_type:"auto" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

     console.log("stream upalod called");
    const result = await streamUpload();
        console.log("Backend file uploded successfully");
      res.status(200).json({
      url:result.secure_url
    })
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/uploadMultiple", upload.array("file"), async (req, res) => {
  try {
    const files=req.files;
    const streamUpload = () =>files.map((file)=>{
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {resource_type:"auto" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );

        streamifier.createReadStream(file.buffer).pipe(stream);
      });
    });

     console.log("stream upalod called");
    const result = await Promise.all(streamUpload());
        console.log("Backend multiple filed uploaded successfully");
      res.status(200).json({
      url:result
    })
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.listen(PORT, ()=>{
    console.log(`http://localhost:${PORT}`);
    
})