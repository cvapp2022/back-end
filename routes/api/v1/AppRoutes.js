const express = require('express');
const router = express.Router();
const AppController=require('../../../controllers/api/AppController')


//authenticate using facebook
router.get('/init/:lang',AppController.init)








module.exports = router;