import multer from "multer";

const storage = multer.diskStorage({
    destination : function(req,file,cb){            //here, req come from user side(json,url), file is present in multer(to store files), cb = callback 
        cb(null,"./public/temp")
    },
    filename : function(req,file,cb) {
        
        cb(null,file.originalname)
        console.log(file.originalname);         //we can not use 'file.originalname' because due to this there are many same name occur due to this overriding occur
    }
})

export const upload = multer({
    storage,
})