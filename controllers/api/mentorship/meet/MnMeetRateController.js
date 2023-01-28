const { validationResult } = require('express-validator')
const MnMeetRateModel = require('../../../../models/mn/Meet/MeetRate')
const MnMeetModel = require('../../../../models/mn/MnMeetSchema')
module.exports.Save = function (req, res) {


    //validate inputs
    const errors = validationResult(req);

    if (errors.errors.length > 0) {
        return res.json({
            success: false,
            payload: errors.errors,
            msg: 'Validation Error'
        });
    }

    //get meet 
    var meetId = req.body.RateMeetIdI
    MnMeetModel.findById(meetId, function (err, result) {

        if (!err && result) {

            //save meet Rate
            var saveRate = new MnMeetRateModel();
            saveRate.RateSelection1 = req.body.RateSelectionI;
            saveRate.RateSelection2 = req.body.RateSelection2I;
            saveRate.RateDesc = req.body.RateDescI;
            saveRate.RateMeet = meetId;
            saveRate.save(function (err1, result1) {
                console.log(err1)
                //push rate to meet
                result.MeetRates.push(result1._id)
                result.save(function (err2, result2) {
                    if (!err2 && result2) {

                        return res.json({
                            success: true,
                            payload: result,
                            message: 'Rate Successfully created'
                        })

                    }
                });

            })

        }

    })



}