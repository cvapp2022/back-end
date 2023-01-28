const express = require('express')
const multer = require('multer');
const validate =require('../../others/validation')

var router = express.Router();
const upload = multer({limits:{fieldSize:1024}});

const CTemplateController = require('../../controllers/cpanel/CTemplateController')

router.get('/list',CTemplateController.ListGet)

router.get('/new',CTemplateController.NewGet)

router.get('/delete/:templateId',CTemplateController.Delete)

router.get('/update/:templateId',CTemplateController.UpdateGet)

router.post('/update/:templateId',CTemplateController.UpdatePost)

const pUpload = upload.fields([{ name: 'templateThumbI', maxCount: 1 ,fieldSize:2046}])
router.post('/new',pUpload,validate.TemplateValidate,CTemplateController.NewPost)

module.exports = router;