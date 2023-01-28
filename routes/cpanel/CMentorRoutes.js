const express = require('express')


var MnMentorController =require('../../controllers/cpanel/CMentorController')
const Validate = require('../../others/validation')
const multer = require('multer');


var router = express.Router();
const upload = multer({limits:{fieldSize:1024}});


router.get('/new',MnMentorController.SaveGet)

const pUpload = upload.fields([{ name: 'mentorImgI', maxCount: 1 ,fieldSize:2046}])
router.post('/new',pUpload,Validate.MnMentorValidate,MnMentorController.SavePost)

module.exports = router;