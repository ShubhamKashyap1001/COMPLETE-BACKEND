// import multer from "multer";

// const storage = multer.diskStorage({
//     destination : function(req,file,cb){            //here, req come from user side(json,url), file is present in multer(to store files), cb = callback 
//         cb(null,"./public/temp")
//     },
//     filename : function(req,file,cb) {
        
//         cb(null,file.originalname)
//         console.log(file.originalname);         //we can not use 'file.originalname' because due to this there are many same name occur due to this overriding occur
//     }
// })

// export const upload = multer({
//     storage,
// })

import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname); // safer way to get extension
        cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    }
});

export const upload = multer({ storage });