const express = require('express')
const Validate = require('../../../../others/validation');
const auth = require('../../../../others/auth');

const MeetController = require('../../../../controllers/api/mentorship/MnMeetController')

var router = express.Router();


//router.post('/',auth.validateToken,Validate.MnMeetValidate,MeetController.Save)

router.put('/:meetId',auth.validateToken,Validate.MnMeetValidate,MeetController.Update)

module.exports = router;