const multer = require('multer');
const fs = require('fs');

module.exports.uploadImage = ()=>{
  const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const upload = multer({ storage: storage })
}