const express = require('express')
const Validate = require('../../../../../others/validation');
const auth = require('../../../../../others/auth');
const  MnMeetRateController = require('../../../../../controllers/api/mentorship/meet/MnMeetRateController')

var router = express.Router();


router.post('/',auth.validateToken,Validate.MeetRateValidate,MnMeetRateController.Save)

module.exports = router;