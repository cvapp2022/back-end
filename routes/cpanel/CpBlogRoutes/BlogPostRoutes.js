const BlogPostController = require('../../../controllers/cpanel/blog/BlogPostController')
const validation =require('../../../others/validation');
const express = require('express')
const multer = require('multer');


var router = express.Router();
const upload = multer({limits:{fieldSize:1024}});


router.get('/list',BlogPostController.ListGet)

router.get('/new',BlogPostController.SaveGet)

router.post('/new',validation.BlogPostValidate,BlogPostController.SavePost)

router.get('/:postId/:lang/new',BlogPostController.SaveChildGet)

const pUpload = upload.fields([{ name: 'postThumbI', maxCount: 1 ,fieldSize:2046}])
router.post('/:postId/:lang/new',validation.BlogPostChild,pUpload,BlogPostController.SaveChildPost)

module.exports = router;