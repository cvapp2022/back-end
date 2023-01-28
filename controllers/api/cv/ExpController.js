const { validationResult } = require('express-validator');
const CvModel = require('../../../models/CvSchema');
const ExpModel = require('../../../models/cv/ExperienceSchema');


const facade = require('../../../others/facades');
var ObjectId = require('mongoose').Types.ObjectId;

exports.Save = async function (req, res) {

    //validate Inputs 
    const errors = validationResult(req);
    if (errors.errors.length > 0) {
        return res.status(400).json({
            success: false,
            payload: errors.errors,
            msg: 'Validation Error'
        });
    }

    //get && Cv id 
    var CvId = req.body.ExpCvI;

    try {
            
        await CvModel.findById(CvId).then((result)=>{
            if(!result)
            throw 'unable to find cv';
        })

        
        //gett sort 
        let sortVal;
        await ExpModel.findOne({ CVId: CvId }, {}, { sort: { 'ExpSort': -1 } }).then((result)=>{
           if(!result)
               sortVal = 1;
            else
               sortVal = result.ExpSort + 1;
        })

        //Save Exp
        var saveExp = new ExpModel()
        saveExp.CVId = CvId;
        saveExp.ExpTitle = req.body.ExpTitleI;
        saveExp.ExpDesc = req.body.ExpDescI;
        saveExp.ExpJob = req.body.ExpJobI;
        saveExp.ExpFrom = req.body.ExpFromI;
        saveExp.ExpTo = req.body.ExpToI;
        saveExp.ExpSkill = req.body.ExpSkillI;
        saveExp.ExpSort=sortVal;
        await saveExp.save()

        facade.PushToCvArr(CvId, 'CVExp', saveExp._id)

        //get list of Experiences
        var list=await ExpModel.find({ CVId: CvId },).populate({ path: 'ExpSkill' }).exec();

        return res.status(201).json({
            success: true,
            payload: {
                item: saveExp,
                list
            }
        });

    } catch (error) {
        console.log(error.stack)
        return res.json({
            success: false,
            payload: null,
            message:error
        }); 
    }
}




exports.Update = function (req, res, next) {

    //validate Inputs 
    const errors = validationResult(req);
    if (errors.errors.length > 0) {
        return res.json({
            success: false,
            payload: errors.errors,
            msg: 'Validation Error'
        });
    }

    var ExpId = req.params.expId;
    if (!ObjectId.isValid(ExpId)) {
        return res.json({
            success: false,
            payload: null,
            msg: 'Param not valid'
        });
    }

    var Update = {
        ExpTitle: req.body.ExpTitleI,
        ExpDesc: req.body.ExpDescI,
        ExpJob: req.body.ExpJobI,
        ExpFrom: req.body.ExpFromI,
        ExpTo: req.body.ExpToI,

    }

    //ExpSkill:[{type: mongoose.Schema.Types.ObjectId, ref: 'BLCVSkill'}]

    ExpModel.findOneAndUpdate({ _id: ExpId }, Update, function (err, result) {

        //update Skill Array
        if (!err && result) {

            if (req.body.ExpSkillI > 0) {

                result.ExpSkill.forEach(item => {
                    result.ExpSkill.pull(item);
                });
                var newSkillArr = req.body.ExpSkillI;
                newSkillArr.forEach(item => {
                    result.ExpSkill.push(item);
                })
            }

            result.save();
            return res.json({
                success: true,
                payload: result,
                msg: 'Experience Successfully Updated'
            });

        }
        else {
            return res.json({
                success: false,
                payload: null,
                msg: 'Unable to find Experience'
            });
        }

    })


}





exports.Delete = function (req, res, next) {

    var ExpId = req.params.expId;
    if (!ObjectId.isValid(ExpId)) {
        return res.json({
            success: false,
            payload: null,
            msg: 'Param not valid'
        });
    }

    //Check experiance & Delete  
    ExpModel.findOneAndDelete({ _id: ExpId }, function (err, result) {

        if (!err && result) {
            //Get CV & Remove Edu Id From CVEdu
            facade.PullCvArr(result.CVId, 'CVExp', ExpId)

            //get experiance list
            ExpModel.find({ CVId: result.CVId }, function (err2, result2) {

                if (!err2) {
                    return res.json({
                        success: true,
                        payload: { list: result2 },
                        msg: 'Experience Successfully deleted '
                    });
                }
                else {
                    return res.json({
                        success: false,
                        payload: null,
                        msg: 'unable to delete experience'
                    });
                }
            })
        }
        else {
            return res.json({
                success: false,
                payload: null,
                msg: 'unable to delete experience'
            });
        }
    })
}


exports.ChangeSort = function (req, res) {



    //validate input
    var items = req.body.items;

    if (items.length > 0) {

        items.forEach(item => {
            ExpModel.findOneAndUpdate({ _id: item.id }, { ExpSort: item.sort + 1 }, function (err, res) {

                console.log(err)

            });
        });
        ExpModel.find({ CVId: req.body.CvId }, function (err, result) {

            if (!err && result) {
                res.json(result)
            }
            else {
                res.send('unable to fetch ')
            }

        })

    }

}