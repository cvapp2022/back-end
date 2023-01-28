const ServRequestModel = require('../../../models/service/ServRequestSchema')
const MnMentorModel = require('../../../models/MentorSchema')
const ChatModel = require('../../../models/ChatSchema')
const TransactionModel=require('../../../models/mentor/transactionSchema')
const populate = require('../../../others/populations')
const facades = require('../../../others/facades')





module.exports.Get = async function (req, res) {

    var type = req.params.type;
    var user = req.user;
    let query;
    if (type === 'user') {
        query = { ReqUser: user._id }
    }
    else if (type === 'mentor') {
        var serviceArr;
        await MnMentorModel.findById(user._id).then((result) => {
            if (result) {
                serviceArr = result.MentorServices;
            }
            else{
                return res.json({
                    success: false,
                    payload: null,
                    message: 'Unable to find mentor'
                })
            }
        })
        query = { ReqServ: { $in: serviceArr },ReqState:{$in:['searching','applied','active','completed']}};
    }

    console.log('im here and the query is',query)
    
    //get requests dates 
    ServRequestModel.find(query, function (err2, result2) {
        console.log(err2)
        if (err2) {
            return res.json({
                success: false,
                payload: err2,
                message: 'Unable to get service requests'
            })
        }
        else{
            return res.json({
                success: true,
                payload: result2,
                message: 'Requests Successfully loaded'
            })
        }
    }).populate(populate.ServRequestPopulation)
}



module.exports.getRequestOne=async function(req,res){


    //validate inputs 
    var requestId=req.params.requestId

    ServRequestModel.findById(requestId,function(err,result){
        if(err){
            return res.json({
                success: false,
                payload: err,
                message: 'Unable to get service requests'
            }) 
        }
        else{
            return res.json({
                success: true,
                payload: result,
                message: 'Requests Successfullyxxx loaded'
            })
        }

    }).populate(populate.ServRequestPopulation)

}


module.exports.Apply = async function (req, res) {


    //check param
    var requestId=req.params.requestId;
    
    try {
        //find service request 
        var serviceRequest = await ServRequestModel.findById(requestId).then((result)=>{
            if(!result)
                throw 'unable to find service request';
            return result;
        })

        //push request to mentor requests
        var mentor =await MnMentorModel.findById(req.user._id).then((result)=>{
            if(!result)
                throw 'unable to find mentor';
            return result;
        })
        
        //push service request to mentor
        mentor.MentorServRequests.push(serviceRequest._id)
        await mentor.save()

        //create chat messags
        var saveChat=new ChatModel();
        saveChat.ChatUser=serviceRequest.ReqUser._id;
        saveChat.ChatMentor=req.user._id;
        await saveChat.save();

        //update service Request
        serviceRequest.ReqMentor = mentor._id;
        serviceRequest.ReqChat=saveChat._id;
        serviceRequest.ReqState = 'applied';
        await serviceRequest.save()

        //send notif to user
        var io = req.app.get('socketio');
        //push notification 
        facades.saveNotif('user', serviceRequest.ReqUser._id, 'RedirectToSrRequests', 'notifRequestApplied',{mentorName:mentor.MentorName}, true, io)
        //trigger user 
        io.to(serviceRequest.ReqUser._id.toString()).emit('SR_REQUEST_APPLIED', serviceRequest)
        return res.json({
            success: true,
            payload: serviceRequest,
            message: 'Request Successfully Applied'
        })


    } catch (error) {
        console.log(error.stack)
        return res.json({
            success: false,
            payload: null,
            message:error
        });
    }


        //         appliedRequest.save(function (err4, result4) {
        //             if (!err4 && result4) {

        //                 //facades.saveNotif('mentor')
        //                 MnRequestModel.populate(result4, populate.RequestPopulation, function (err5, result5) {

        //                     var io = req.app.get('socketio');
        //                     //push notification 
        //                     facades.saveNotif('user', appliedRequest.ReqUser._id, 'RedirectToRequests', 'notifRequestApplied',{mentorName:result.MentorName}, true, io)
        //                     //trigger user 
        //                     io.to(appliedRequest.ReqUser._id.toString()).emit('REQUEST_APPLIED', result5)
        //                     return res.json({
        //                         success: true,
        //                         payload: result5,
        //                         message: 'Request Successfully Applied'
        //                     })

        //                 })


        //             }

        //         });

        //     })

        // })
        
    //filter valid requests 
}


module.exports.Complete=async function(req,res){


    //validate inputs 
    var requestId=req.params.requestId;

    try {
        // find update service request state to finish
        var serviceRequest = await ServRequestModel.findById(requestId).populate(populate.ServRequestPopulation).then((result)=>{
            if(!result)
                throw 'unable to find service request';
            return result;
        })

        serviceRequest.ReqState='completed';
        await serviceRequest.save();


        //add transaction to mentor 
        var saveTransaction=new TransactionModel();
        saveTransaction.transactionType='add';
        saveTransaction.transactionValue=serviceRequest.ReqServ.ServPrice
        saveTransaction.transactionMentor=serviceRequest.ReqMentor,
        saveTransaction.transactionDesc="Profit from completing "+serviceRequest.ReqServ.ServName+" service request";
        await saveTransaction.save();

        var mentor =await MnMentorModel.findById(req.user._id).then((result)=>{
            if(!result)
                throw 'unable to find mentor';
            return result;
        })

        mentor.MentorTransaction.push(saveTransaction._id)
        await mentor.save();

        //send notif to user
        var io = req.app.get('socketio');
        //push notification 
        facades.saveNotif('user', serviceRequest.ReqUser._id, 'RedirectToSrRequests', 'notifRequestCompleted',{mentorName:mentor.MentorName}, true, io)
        //trigger user 
        io.to(serviceRequest.ReqUser._id.toString()).emit('SR_REQUEST_COMPLETED', serviceRequest)
        return res.json({
            success: true,
            payload: {serviceRequest,'transaction':saveTransaction},
            message: 'Request Successfully Applied'
        })


    } catch (error) {
        console.log(error.stack)
        return res.json({
            success: false,
            payload: null,
            message:error
        });
    }



    
    


}