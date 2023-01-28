const express = require('express');
const router = express.Router();
const auth = require('../../../../others/auth');
const PositionRepoController=require('../../../../controllers/api/repo/RepoPositionController')

router.get('/',auth.validateToken,PositionRepoController.Get)



module.exports = router;