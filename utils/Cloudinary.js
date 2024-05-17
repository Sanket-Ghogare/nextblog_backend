import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';      
cloudinary.config({ 
  cloud_name: 'dwxx394bm', 
  api_key: '615751731396962', 
  api_secret: '5E0tN6Sr6EO4xc1Aoa4Xck6karI' 
});

const uploadOnCloudnary=async(localFilePath)=>{

    try {
        if(!localFilePath) return null
        //upload the file on cloudnary
     const response= await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        //file as uploaded sucessfully
console.log("uploded Successfully",response.url);
return response;

    } catch (error) {
        fs.unlinkSync(localFilePath);  
    }
}


export  default uploadOnCloudnary;