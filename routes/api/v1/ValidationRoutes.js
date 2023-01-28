const express = require('express');
const router = express.Router();
const ValidationController= require('../../../controllers/api/ValidationController')


router.get('/email/:value',ValidationController.EmailValidate);





module.exports = router;