const express = require('express')

const WithdrawRequestsController=require('../../../controllers/cpanel/mentor/WithdrawRequestsController')

var router = express.Router();

router.get('/',WithdrawRequestsController.Get)

router.get('/:withdrawRequestId/Apply',WithdrawRequestsController.Apply)

module.exports = router;