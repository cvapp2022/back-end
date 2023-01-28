const ServiceModel = require('../../models/ServiceSchema')
const ServiceChildModel = require('../../models/service/ChildSchema')
const MnMentorModel= require('../../models/MentorSchema')
const facades = require('../../others/facades')
const { validationResult } = require('express-validator');



exports.ListGet = function (req, res) {

    ServiceModel.find({}, function (err, result) {
        return res.render('cpanel/services/list', { services: result })
    })

}


exports.NewGet = function (req, res) {
    return res.render('cpanel/services/new')

}

exports.NewPost = async function (req, res) {


    //validate inputs 
    const errors = validationResult(req);
    if (errors.errors.length > 0 || !req.files.servImgI) {
        return res.status(400).json({
            success: false,
            payload: { err: errors.errors, body: req.body },
            msg: 'Validation x Error'
        });
    }

    //updload Service image
    var folderId = await facades.createFolder(req.body.servNameI, 'services')
    if (!folderId) {
        return res.json({
            success: false,
            payload: null,
            message: 'unable to create service folder'
        })
    }

    facades.uploadFileTo(req.files.servImgI[0], 'service', folderId, function (fildId) {

        //save service
        var saveService = new ServiceModel();
        saveService.ServName = req.body.servNameI;
        saveService.ServDesc = req.body.servDescI;
        saveService.ServPrice=req.body.servPriceI;
        saveService.ServImg = fildId;
        saveService.ServFolder = folderId;
        saveService.save().then((result) => {

            //save childService
            var saveServChild = new ServiceChildModel();
            saveServChild.ChildName = req.body.servNameI;
            saveServChild.ChildDesc = req.body.servDescI;
            saveServChild.ChildLang = process.env.DEFAULT_LANGUAGE; //default lang
            saveServChild.ChildService = result._id;
            saveServChild.save().then((childResult) => {
                result.ServChilds.push(childResult._id)
                result.save().then(() => {
                    return res.send('Service saved');
                });
            })
        })
    })
}


module.exports.PublishService = async function (req, res) {

    //validate publish service
    var servId = req.body.serviceId;
    console.log(servId)
    if (!servId) {
        res.send('validation error')
    }

    //get services
    var checkService = await ServiceModel.findById(servId).then((result) => {
        return result;
    }).catch(() => {
        res.send('unable to find service')
    })

    //update service status
    checkService.ServStatus = 1;
    checkService.save().then((result) => {

        var io = req.app.get('socketio');
        //send notifiacation to user
        facades.saveNotif('userall', '', 'RedirectToService', 'notifService', { serviceName: result.ServName }, true, io)

        //send socket to all users to update service
        var io = req.app.get('socketio');
        io.emit('SERVICE_CREATED', result)

        res.send('Service Successfully Published')
    }).catch(() => {
        res.send('unable to update service')
    })
}

module.exports.SuspendService = async function (req, res) {

    //validate suspend service
    var servId = req.body.serviceId;
    if (!servId) {
        res.send('validation error')
    }
    //get services
    var checkService = await ServiceModel.findById(servId).then((result) => {
        return result;
    }).catch(() => {
        res.send('unable to find service')
    })

    //update service status suspend
    checkService.ServStatus = 0;
    checkService.save().then((result) => {
        res.send('Service Successfully Suspended')
    }).catch(() => {
        res.send('unable to update service')
    })
}


module.exports.ServiceOneGet = function (req, res) {


    //get service
    var servId = req.params.servId;
    Promise.all([ServiceModel.findById(servId), MnMentorModel.find({ MentorStatus: 1 })]).then((val) => {

        var service = val[0];
        var mentors = val[1];

        var mentorsArr = [];
        mentors.forEach((item) => {
            var inService;
            if (service.ServMentors.includes(item._id)) {
                inService = true;
            }
            else {
                inService = false;
            }
            mentorsArr.push({ item, inService });

        })
        return res.render('cpanel/services/serviceOne', { 'service': service, 'mentors': mentorsArr })

    })
}

module.exports.addMentorToServ = function (req, res) {

    var mentorId = req.body.mentorId;
    var servId = req.body.serviceId;
    if (!mentorId || !servId) {

        return res.send('validation error')
    }

    //push mentor to service
    Promise.all([ServiceModel.findById(servId), MnMentorModel.findOne({ _id: mentorId, MentorStatus: 1 })]).then((val) => {

        var service = val[0];
        var mentor = val[1];
        if (service && mentor) {

            //check if mentor already in service
            if (service.ServMentors.includes(mentor._id)) {
                res.send('mentor already in the service')
            }
            else {
                service.ServMentors.push(mentor._id);
                service.save();
                
                mentor.MentorServices.push(service._id)
                mentor.save();

                var io = req.app.get('socketio');
                //send notification 
                facades.saveNotif('mentor', mentorId, 'RedirectToServices', 'notifMentorAddedToService', { serviceName: service.ServName }, true, io)

                //trigger mentor 
                var io = req.app.get('socketio');
                io.to(mentorId).emit('MENTOR_ADDED_TO_SERVICE')

                res.send('mentor pushed')
                // io.sockets.in('test').broadcast('MENTOR_ADDED_TO_PROGRAM')
            }

        }

    })
}



module.exports.removeMentorFromServ = function (req, res) {

    //validate inputs 
    var mentorId = req.body.mentorId;
    var servId = req.body.serviceId;
    if (!mentorId || !servId) {
        return res.send('validation error')
    }

    //push mentor to service
    Promise.all([ServiceModel.findById(servId), MnMentorModel.findOne({ _id: mentorId, MentorStatus: 1 })]).then((val) => {

        var service = val[0];
        var mentor = val[1];
        if (service && mentor) {

            //check if mentor already in service
            if (service.ServMentors.includes(mentor._id)) {
                service.ServMentors.pull(mentor._id);
                service.save();

                mentor.MentorServices.pull(service._id)
                mentor.save();

                var io = req.app.get('socketio');
                //send notification
                facades.saveNotif('mentor', mentorId, 'RedirectToServices', 'notifMentorRemovedFromService', { serviceName: service.ServName }, true, io)

                //trigger mentor
                var io = req.app.get('socketio');
                io.to(mentorId).emit('MENTOR_REMOVED_FROM_SERVICE')
                res.send('mentor pulled')
            }
            else {
                res.send('mentor not in the service')
            }

        }

    })
}