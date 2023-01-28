// const SrMessageRequestModel=require('../../../../models/service/Request/RequestMessage')
const ChatModel = require('../../../../models/ChatSchema')
const MessageModel = require('../../../../models/chat/ChMessageModel')
const SrServRequest = require('../../../../models/service/ServRequestSchema')
const { validationResult } = require('express-validator')
exports.Save = async function (req, res) {

    //validate param
    var requestId = req.params.requestId;

    //validate inputs 
    const errors = validationResult(req);

    if (errors.errors.length > 0) {
        return res.json({
            success: false,
            payload: errors.errors,
            msg: 'Validation Error'
        });
    }

    try {

        //check and get service request
        var serviceRequest = await SrServRequest.findById(requestId).then((result) => {
            if (!result)
                throw 'unable to find service request';
            return result;
        })

        //save message request
        var saveMessageRequest = new MessageModel();
        saveMessageRequest.ChMessageType = 'text'
        saveMessageRequest.ChMessageFrom = req.body.msgFromI;
        saveMessageRequest.ChMessageVal = req.body.msgValueI
        saveMessageRequest.ChMessageSender = req.body.msgSenderIdI
        saveMessageRequest.ChMessageChat = serviceRequest.ReqChat
        if (req.body.msgFromI === 'user')
            saveMessageRequest.externalModelType = 'BLUser';
        else if (req.body.msgFromI === 'mentor')
            saveMessageRequest.externalModelType = 'MnMentor';
        await saveMessageRequest.save();

        //get and push message to request chat
        await ChatModel.findById(serviceRequest.ReqChat).then(async (result) => {
            if (!result)
                throw 'unable to find chat';
                
            result.ChatMessages.push(saveMessageRequest._id)
            await result.save()
        })

        var io = req.app.get('socketio');
        // io.to(serviceRequest.ReqUser.toString()).emit('REQUEST_MESSAGE_SENT', saveMessageRequest)
        // io.to(serviceRequest.ReqMentor.toString()).emit('REQUEST_MESSAGE_SENT', saveMessageRequest)

        return res.json({
            success: true,
            payload: saveMessageRequest,
            message: 'Message Successfully saved'
        })


    } catch (error) {
        console.log(error.stack)
        return res.json({
            success: false,
            payload: null,
            message: error
        });
    }
}