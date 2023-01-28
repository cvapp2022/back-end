const { validationResult } = require('express-validator');
const CvModel = require('../../../models/CvSchema');
const AwModel = require('../../../models/cv/AwSchema');

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
    var CvId = req.body.AwCvI;

    try {

        await CvModel.findById(CvId).then((result)=>{
            if(!result)
                throw 'unable to find cv';
        })

        
        //gett sort 
        let sortVal;
       await AwModel.findOne({ CVId: CvId }, {}, { sort: { 'AwSort': -1 } }).then((result)=>{
           if(!result)
               sortVal = 1;
           else
               sortVal = result.AwSort + 1;
       })

        //save award
        var saveAw = new AwModel();
        saveAw.CVId = CvId;
        saveAw.AwTitle = req.body.AwTitleI;
        saveAw.AwDesc = req.body.AwDescI;
        saveAw.AwJob = req.body.AwJobI;
        saveAw.AwDate = req.body.AwDateI;
        saveAw.AwSort = sortVal;
        await saveAw.save();

        facade.PushToCvArr(CvId, 'CVAw', saveAw._id)

        //get list of Award
        var list=await AwModel.find({ CVId: CvId }).exec();

        return res.status(201).json({
            success: true,
            payload: {
                item: saveAw,
                list
            }
        });

    } catch (error) {
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

    var AwId = req.params.awId;
    if (!ObjectId.isValid(AwId)) {
        return res.json({
            success: false,
            payload: null,
            msg: 'Param not valid'
        });
    }

    var Update = {
        AwTitle: req.body.AwTitleI,
        AwDesc: req.body.AwDescI,
        AwJob: req.body.AwJobI,
        AwDate: req.body.AwDateI,
    }

    AwModel.findOneAndUpdate({ _id: AwId }, Update, function (err, result) {

        if (!err && result) {
            result.save();
            return res.json({
                success: true,
                payload: result,
                msg: 'Award Successfully updated'
            });
        }
        else {
            return res.json({
                success: false,
                payload: null,
                msg: 'Unable to find Award'
            });
        }

    })

}


exports.Delete = function (req, res, next) {

    var AwId = req.params.awId;
    if (!ObjectId.isValid(AwId)) {
        return res.json({
            success: false,
            payload: null,
            msg: 'Param not valid'
        });
    }


    //Check Award & Delete
    AwModel.findOneAndDelete({ _id: AwId }, function (err, result) {

        if (!err && result) {
            //Get CV & Remove Award Id From CVProj
            facade.PullCvArr(result.CVId, 'CVAw', AwId)
            AwModel.find({ CVId: result.CVId }, function (err2, result2) {

                if (!err2) {
                    return res.json({
                        success: true,
                        payload: { list: result2 },
                        msg: 'Award Successfully Deleted'
                    });
                }
                else {
                    return res.json({
                        success: false,
                        payload: null,
                        msg: 'Unable to delete Award'
                    });
                }
            })

        }
        else {
            return res.json({
                success: false,
                payload: null,
                msg: 'Unable to find Award'
            });
        }

    })
}


exports.ChangeSort = function (req, res) {



    //validate input
    var items = req.body.items;

    if (items.length > 0) {

        items.forEach(item => {
            AwModel.findOneAndUpdate({ _id: item.id }, { AwSort: item.sort + 1 }, function (err, res) {

                console.log(err)

            });
        });
        AwModel.find({ CVId: req.body.CvId }, function (err, result) {

            if (!err && result) {

                console.log(result)

                res.json(result)
            }
            else {
                res.send('unable to fetch ')
            }

        })

    }

}