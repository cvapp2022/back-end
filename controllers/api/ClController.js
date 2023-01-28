const { validationResult } = require('express-validator')
var ObjectId = require('mongoose').Types.ObjectId;


const ClModel = require('../../models/ClSchema');
const UserModel = require('../../models/UserSchema');


exports.Get = function (req, res) {

    var ClId = req.params.clId;
    if (!ObjectId.isValid(ClId)) {
        return res.json({
            success: false,
            payload: errors.errors,
            msg: 'Validation Error'
        });
    }

    ClModel.findById(ClId, function (err, result) {

        if (result && !err) {
            res.json({
                success: true,
                payload: result,
                msg: 'Cover Letter Successfuly Loaded'
            });
        }
    })

}


exports.Save = function (req, res) {

    //validate inputs 
    const errors = validationResult(req);

    if (errors.errors.length > 0) {
        return res.json({
            success: false,
            payload: errors.errors,
            msg: 'Validation Error'
        });
    }

    var SaveCl = new ClModel();
    SaveCl.CLName = req.body.ClNameI;
    SaveCl.CLTemplate='62b74a1d6ae2a8130d5a44b8'
    SaveCl.CLUId = req.user._id;
    SaveCl.save(function (err, result) {
        console.log(err,result)
        if (result && !err) {

            //push cv id to user
            UserModel.findOne({ _id: req.user._id }, function (err2, result2) {

                if (result2 && !err2) {
                    result2['BlUserCl'].push(result._id)
                    result2.save();

                    ClModel.find({ CLUId: req.user._id }, function (err3, result3) {
                        console.log(result3)
                        if (!err3 && result3) {

                            return res.json({
                                success: true,
                                payload: { list: result3, item: result },
                                msg: 'Cover letter Successfully created '
                            });

                        }

                    })
                }

            })
            //res.send(result)
        }
    })

}


exports.Update = function (req, res) {

    //validate Inputs 
    const errors = validationResult(req);
    if (errors.errors.length > 0) {
        return res.json({
            success: false,
            payload: errors.errors,
            msg: 'Validation Error'
        });
    }

    var ClId = req.params.clId;
    if (!ObjectId.isValid(ClId)) {
        return res.json({
            success: false,
            payload: errors.errors,
            msg: 'Validation Error'
        });
    }

    var Update = {
        ClName: req.body.ClNameI,
        CLFullName: req.body.CLFullNameI,
        CLJob: req.body.CLJobI,
        CLAddress: req.body.CLAddressI,
        CLMail: req.body.CLMailI,
        CLPhone: req.body.CLPhoneI,
        CLCmpName: req.body.CLCmpNameI,
        CLCmpHrName: req.body.CLCmpHrNameI,
        CLBody: req.body.CLBodyI
    }

    ClModel.findOneAndUpdate({ _id: ClId }, Update, function (err, result) {

        if (!err && result) {
            return res.json({
                success: true,
                payload: result,
                msg: 'Cl Successfully Updated'
            });
        }
        else {
            return res.json({
                success: false,
                payload: errors.errors,
                msg: 'Unable to find cl'
            });
        }

    })

}

exports.Delete = function (req, res) {

    var ClId = new ObjectId(req.params.clId);
    if (!ObjectId.isValid(req.params.clId)) {
        return res.json({
            success: false,
            payload: errors.errors,
            msg: 'Validation Error'
        });
    }

    //remove Cl From User arr
    ClModel.findByIdAndDelete(ClId, function (err, result) {

        if (!err && result) {
            UserModel.findOne({ _id: req.user._id }, function (err2, result2) {

                if (result2 && !err2) {
                    result2['BlUserCl'].pull(result._id)
                    result2.save();

                    ClModel.find({ CLUId: req.user._id }, function (err3, result3) {
                        console.log(result3)
                        if (!err3 && result3) {

                            return res.json({
                                success: true,
                                payload: { list: result3, item: result },
                                msg: 'Cover letter Successfully Deleted '
                            });
                        }
                    })
                }
            })
        }
        else {
            return res.json({
                success: true,
                payload: null,
                msg: 'unable to find cover letter '
            });
        }

    })

}

exports.SetTemplate=function(req,res){

    
    //validate param 
    var ClId = new ObjectId(req.params.clId);
    if (!ObjectId.isValid(req.params.clId)) {
        return res.json({
            success: false,
            payload: null,
            msg: 'Param not valid xxx'
        });
    }
    
    //validate input
    var newTemplate=req.body.TemplateIdI;
    if (!ObjectId.isValid(newTemplate)) {
        return res.json({
            success: false,
            payload: null,
            msg: 'Template is required'
        });
    }

    ClModel.findOneAndUpdate({ _id:ClId},{CLTemplate:newTemplate},function(err,result){

        if(!err && result){
            return res.json({
                success: true,
                payload: result,
                msg: 'cl Template Successfully updated'
            });
        }
    })


}