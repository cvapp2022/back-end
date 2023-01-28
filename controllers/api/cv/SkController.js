const { validationResult } = require('express-validator')
var ObjectId = require('mongoose').Types.ObjectId;


const SkillModel = require('../../../models/cv/SkillSchema')
const CVModel = require("../../../models/CvSchema");
const ExpModel = require('../../../models/cv/ExperienceSchema');
const EduModel = require('../../../models/cv/EducationSchema');

const facade = require('../../../others/facades')

exports.Save = function (req, res, next) {

    //Validate Inputs 
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        console.log(errors.array())
        return res.status(422).json({ errors: errors.array() })
    }

    var CvId = req.body.SkillCvI;
    facade.CheckCv(CvId, req.user._id, function (x) {
        if (!x) {
            return res.json({
                success: false,
                payload: null,
                msg: 'Invalid cv'
            });
        }
    })

    //generate random color
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }

    //Save Skill 
    var saveSkill = new SkillModel();
    saveSkill.CVId = CvId;
    saveSkill.SkillTitle = req.body.SkillTitleI;
    saveSkill.SkillDesc = req.body.SkillDescI;
    saveSkill.SkillVal = req.body.SkillValI;
    saveSkill.SkillColor = color;
    saveSkill.save(function (err, result) {

        if (!err) {
            //update CV ref 
            facade.PushToCvArr(CvId, 'CVSkill', saveSkill._id);

            //get Skills
            SkillModel.find({ CVId: CvId }, function (err2, result2) {

                if (!err2) {

                    return res.status(201).json({
                        success: true,
                        payload: {
                            item: result,
                            list: result2
                        }
                    });

                }


            })
        }
    })
}




exports.Update = function (req, res, next) {


    //Validate Inputs 
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        console.log(errors.array())
        return res.status(422).json({ errors: errors.array() })
    }

    //Check Skill Id param
    var skId = req.params.skId;
    if (!ObjectId.isValid(skId)) {
        return res.json({
            success: false,
            payload: null,
            msg: 'Param not valid'
        });
    }


    //Update Skill
    var Update = {

        SkillTitle: req.body.SkillTitleI,
        SkillDesc: req.body.SkillDescI,
        SkillVal: req.body.SkillValI,
        SkillColor: req.body.SkillColorI

    };

    SkillModel.findOneAndUpdate({ _id: skId }, Update, function (err, result) {

        if (!err && result) {
            return res.send('Skill Updated ')
        }
        else {
            return res.send('Unable To Update Skill')
        }
    })
}



exports.Delete = function (req, res, next) {

    var skId = req.params.skId;
    if (!ObjectId.isValid(skId)) {
        return res.json({
            success: false,
            payload: null,
            msg: 'Param not valid'
        });
    }

    //Check Education & Delete  
    SkillModel.findOneAndDelete({ _id: skId }, function (err, result) {
        console.log('err', err)
        console.log('res', result)
        if (!err && result) {
            //Get CV & Remove Edu Id From CVEdu
            facade.PullCvArr(result.CVId, 'CVSkill', skId)

            //get All skills
            SkillModel.find({ CVId: result.CVId }, function (err2, result2) {

                if (!err2)
                    return res.status(200).json({
                        status: true,
                        items: {
                            item: result,
                            list: result2
                        }
                    });

            })
        }
        else {
            return res.status(400).json({
                success: false,
                items: null
            });
        }
    })

}

exports.Push = function (req, res, next) {

    //validate inputs
    var type = req.body.type;
    var item = req.body.item;
    var skill = req.body.skill;


    //check type of item
    if (type === 'experience') {

        ExpModel.findOne({ _id: item }, function (err, result) {

            if (!err && result) {

                //check if skill is unique
                if (result.ExpSkill.includes(skill)) {
                    return res.status(400).json({
                        status: true,
                        message: 'Skill Already Exist',
                        items: {
                            item: null
                        }
                    });
                }
                else {

                    //push skill to experience
                    result.ExpSkill.push(skill);
                    result.save();

                    return res.status(200).json({
                        status: true,
                        message: 'Skill Pushed',
                        items: {
                            item: result
                        }
                    });
                }
            }
            else {
                res.send('unable to Update Experience Skill');
            }
        })
    }
    else if (type === 'education') {

        EduModel.findOne({ _id: item }, function (err, result) {

            if (!err && result) {

                //cHECK IF Skill is unique
                if (result.EduSkill.includes(skill)) {

                    return res.status(400).json({
                        status: true,
                        message: 'Skill Already Exist',
                        items: {
                            item: null
                        }
                    });
                }
                else {

                    result.EduSkill.push(skill);
                    result.save();

                    return res.status(200).json({
                        status: true,
                        message: 'Skill Pushed',
                        items: {
                            item: result
                        }
                    });

                }
            }
            else {
                res.send('unable to Update Experience Skill');
            }
        })
    }
    else {
        res.send('wrong filte type');
    }

}


exports.Pull = function (req, res, next) {

    //validate inputs
    var type = req.body.type;
    var item = req.body.item;
    var skill = req.body.skill;

    if (type === 'experience') {
        ExpModel.findOne({ _id: item }, function (err, result) {
            if (!err && result) {

                //check skill in skill arr 
                if (result.ExpSkill.includes(skill)) {

                    //pull skill 
                    result.ExpSkill.pull(skill);
                    result.save();

                    return res.status(200).json({
                        status: true,
                        message: 'Skill pulled',
                        items: {
                            item: result
                        }
                    });
                }
                else {
                    return res.status(400).json({
                        status: true,
                        message: 'uable to pull skill',
                        items: null
                    });
                }
            }
            else {
                res.send('unable to find experience');
            }
        })

    }
    else if (type === 'education') {
        EduModel.findOne({ _id: item }, function (err, result) {
            if (!err && result) {

                //check skill in skill arr 
                if (result.EduSkill.includes(skill)) {

                    //pull skill 
                    result.EduSkill.pull(skill);
                    result.save();

                    return res.status(200).json({
                        status: true,
                        message: 'Skill pulled',
                        items: {
                            item: result
                        }
                    });
                }
                else {
                    return res.status(400).json({
                        status: true,
                        message: 'uable to pull skill',
                        items: null
                    });
                }
            }
            else {
                res.send('unable to find experience');
            }
        })
    }


}