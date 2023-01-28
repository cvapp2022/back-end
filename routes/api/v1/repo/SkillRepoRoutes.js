const express = require('express');
const router = express.Router();
const auth = require('../../../../others/auth');
const SkillRepoController=require('../../../../controllers/api/repo/RepoSkillController')

router.get('/:cvId',auth.validateToken,SkillRepoController.Get)



module.exports = router;