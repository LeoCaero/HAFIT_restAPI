const cloudinary = require('cloudinary').v2;
const multer = require("multer");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
  });

const storage = multer.diskStorage({
    destination: function (req,file,cb){
      cb(null , '../uploads')
    },
    filename: function(req,file,cb){
      cb(null,new Date().toISOString() +'-'+file.originalname)
    }
   })

   const fileFilter = (req,file,cb)=>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
      cb(null,true)
    }else{
      cb({message: 'Unsupported file format'},false)
    }
   }
   const upload = multer({
    storage: storage,
    limits: {fileSize: 1024 * 1024},
    fileFilter: fileFilter
   })
   exports.uploads = (file,folder)=>{
    return new Promise(resolve=>{
      cloudinary.uploader.upload(file,(result)=>{
        resolve({
          url:result.url,
          id: result.public_id
        })
      },{
        resource_type: "auto",
        folde:folder
      })
    })
   }