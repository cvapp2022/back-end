const express = require('express')

const CpanelController=require('../../controllers/cpanel/CpanelController')


var router = express.Router();

router.get('/',CpanelController.index)

module.exports = router;