const express = require('express')

const Validate=require('../../others/validation');
const ConfigController=require('../../controllers/cpanel/CConfigController');

var router = express.Router();


router.get('/list',ConfigController.ListGet)

router.get('/new',ConfigController.NewGet)

router.post('/new',Validate.ConfigValidate,ConfigController.newPost)

router.get('/update/:configId',ConfigController.UpdateGet)

router.post('/update/:configId',Validate.ConfigValidate,ConfigController.UpdatePost)

module.exports = router;