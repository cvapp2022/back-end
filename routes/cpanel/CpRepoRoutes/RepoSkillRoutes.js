const express = require('express')

const RepoSkillController = require('../../../controllers/cpanel/repo/SkillRepoController')
const validate = require('../../../others/validation')

var router = express.Router();

router.get('/list',RepoSkillController.ListGet)

router.get('/new',RepoSkillController.SaveGet)

router.post('/new',validate.SkillRepoValidate,RepoSkillController.SavePost)

router.get('/:skillRepoId/delete',RepoSkillController.DeleteGet)

module.exports = router;