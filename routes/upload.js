var express = require('express');
var router = express.Router();
const path = require('path')
const multer  = require('multer')
const fs = require('fs')
const PATH_UPLOAD = path.join(__dirname,'../uploads')
const PATH_AVATAR_UPLOAD = path.join(__dirname,'../uploads/avatar')
if(!fs.existsSync(PATH_UPLOAD)){
    fs.mkdirSync(PATH_UPLOAD)
}
if(!fs.existsSync(PATH_AVATAR_UPLOAD)){
    fs.mkdirSync(PATH_AVATAR_UPLOAD)
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, PATH_AVATAR_UPLOAD)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, `${uniqueSuffix}_${file.originalname}`)
    }
})

const upload = multer({
    storage: storage
})

router.post('/', upload.single('avatar'), function(req, res, next) {
  res.json('them anh thanh cong')
});

module.exports = router;
