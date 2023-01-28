const express = require('express')


var MnProgramController =require('../../../controllers/cpanel/mentorship/MnProgramController')
const MnProgramPreparation=require('../../../controllers/cpanel/mentorship/program/MnProgramPreparationController')
const MnProgramChildController =require('../../../controllers/cpanel/mentorship/program/MnProgramChildController')
const Validate = require('../../../others/validation')
const multer = require('multer');


var router = express.Router();
const upload = multer();


router.get('/new',MnProgramController.SaveGet)

const pUpload = upload.fields([{ name: 'progImgI', maxCount: 1 }])
router.post('/new',pUpload,MnProgramController.SavePost)

router.get('/list',MnProgramController.ListGet)

router.get('/:progId',MnProgramController.ProgramOneGet)


router.get('/:progId/preparation/:prepId',MnProgramPreparation.prepareOneGet)

const pupload2=upload.fields([{name: 'file',fieldSize:524288}])
router.post('/:progId/preparation/:prepId/upload/:lang',pupload2,MnProgramPreparation.prepareUpload)

// router.post('/:progId/:meet/preparation/new',Validate.ProgramPreparationValidate,MnProgramPreparation.SavePost)
router.get('/:progId/child/:lang',MnProgramChildController.Get)

router.post('/:progId/child/:lang',MnProgramChildController.Save)

router.post('/:progId/child/:lang/update',MnProgramChildController.Update)

router.post('/addMentorToProg',MnProgramController.addMentorToProg)

router.post('/removeMentorFromProg',MnProgramController.removeMentorFromProg)

router.put('/publishProgram',MnProgramController.PublishProgram)

router.put('/suspendProgram',MnProgramController.SuspendProgram)
module.exports = router;