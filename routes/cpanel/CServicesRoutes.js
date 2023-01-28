const express = require('express')

const CServicesController=require('../../controllers/cpanel/CServicesController')
const CServiceChildController=require('../../controllers/cpanel/service/ServiceChildController')
const Validate=require('../../others/validation')

const multer = require('multer');



var router = express.Router();
const upload = multer();

router.get('/',CServicesController.ListGet)

router.get('/new',CServicesController.NewGet)

const sUpload = upload.fields([{ name: 'servImgI', maxCount: 1 }])
router.post('/new',sUpload,Validate.ServiceValidate,CServicesController.NewPost)

router.get('/:servId',CServicesController.ServiceOneGet)

router.get('/:servId/child/:lang',CServiceChildController.Get)

router.post('/:servId/child/:lang',CServiceChildController.Save)

router.post('/:servId/child/:lang/update',CServiceChildController.Update)

router.put('/publishService',CServicesController.PublishService)

router.put('/suspendService',CServicesController.SuspendService)

router.post('/addMentorToServ',CServicesController.addMentorToServ)

router.post('/removeMentorFromServ',CServicesController.removeMentorFromServ)

module.exports = router;