const express = require('express')

const BlogCategoryController =require('../../../controllers/cpanel/blog/BlogCategoryController')
const validation =require('../../../others/validation')

var router = express.Router();



router.get('/new',BlogCategoryController.SaveGet)


router.post('/new',validation.BlogCategoryValidate,BlogCategoryController.SavePost)

module.exports = router;