const express = require('express')
const ProgramController =  require('../../../../controllers/api/mentorship/MnProgramController')
const auth = require('../../../../others/auth');



var router = express.Router();


router.get('/:lang',auth.validateToken,ProgramController.Get);

module.exports = router;  