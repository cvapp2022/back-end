const express = require('express')
const Validate = require('../../../../../others/validation');
const auth = require('../../../../../others/auth');
const multer = require('multer');

const SessionController = require('../../../../../controllers/api/mentorship/meet/MnSessionController')
const MessageController = require('../../../../../controllers/api/mentorship/meet/session/MessageController')

var router = express.Router();
const upload = multer({limits:{fieldSize:1024}});

router.post('/',auth.validateToken,Validate.MnMeetValidate,SessionController.Save) //only for mentor

// const pUpload = upload.fields([{ name: 'mentorImgI', maxCount: 1 ,fieldSize:2046}])
const pUpload=upload.single('file');
router.post('/:sessionId/upload',pUpload,auth.validateToken,SessionController.Upload)

router.post('/:sessionId/message',auth.validateToken,Validate.MessageValidate,MessageController.Save)

module.exports = router;