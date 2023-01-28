const express = require('express')


const CUsersController = require('../../controllers/cpanel/CUsersController')


var router = express.Router();


router.get('/new',CUsersController.NewGet)

router.post('/new',CUsersController.NewPost)


module.exports = router;