    // const uploadResult = await cloudinary.uploader
    //    .upload(
    //        'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
    //            public_id: 'shoes',
    //        }
    //    )
    //    .catch((error) => {
    //        console.log(error);
    //    });
    
    // console.log(uploadResult);


import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Correct Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET       // Click 'View API Keys' above to copy your API secret

});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        // Upload the file on Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        console.log("File is uploaded on Cloudinary:", response.url);
        fs.unlinkSync(localFilePath)
        return response;
    } catch (error) {
        // Remove the locally saved file if upload fails
        fs.unlinkSync(localFilePath);       //remove the locally saved temporary file as the upload operation got failed
        console.log("Upload error:", error);
        return null;
    }
};

export { uploadOnCloudinary };

    