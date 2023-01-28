const MnProgramModel = require('../../../models/mn/MnProgramSchema')
const populate = require('../../../others/populations')


module.exports.Get = function (req, res) {


    //validte params
    var lang = req.params.lang;

    //get programs
    MnProgramModel.find({ ProgStatus: 1 }, function (err, result) {

        if (!err) {
            return res.json({
                success: true,
                payload: result,
                message: 'Programs Successfully loaded'
            })
        }
        else {
            return res.json({
                success: false,
                payload: null,
                message: 'Unable to load programs'
            })
        }

    }).populate([
        {
            path: 'ProgMentors'
        },
        {
            path: 'ProgPreparation'
        },
        {
            path: 'ProgChilds',
            match: { ChildLang: lang }
        }
    ])
}