const express = require('express');

const PostController =require('../../../../controllers/api/blog/PostController')

const router = express.Router();


router.get('/:lang',PostController.All)

router.get('/:lang/:title',PostController.Get)


module.exports = router;