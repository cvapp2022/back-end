
const MessageModel=require('../../models/chat/ChMessageModel')
const ChatModel=require('../../models/ChatSchema')
const { validationResult } = require('express-validator')

exports.saveMessage=async function(req,res){

    //validate params
    var chatId=req.params.chatId

    //validate inputs 
    const errors = validationResult(req);

    if (errors.errors.length > 0) {
        return res.json({
            success: false,
            payload: errors.errors,
            msg: 'Validation Error'
        });
    }

    console.log(chatId)

    try{

        //save message request
        var saveMessageRequest = new MessageModel();
        saveMessageRequest.ChMessageType = 'text'
        saveMessageRequest.ChMessageFrom = req.body.msgFromI;
        saveMessageRequest.ChMessageVal = req.body.msgValueI
        saveMessageRequest.ChMessageSender = req.body.msgSenderIdI
        saveMessageRequest.ChMessageChat = chatId
        if (req.body.msgFromI === 'user')
            saveMessageRequest.externalModelType = 'BLUser';
        else if (req.body.msgFromI === 'mentor')
            saveMessageRequest.externalModelType = 'MnMentor';
        await saveMessageRequest.save();


        //get and push message to request chat
        var chat =await ChatModel.findById(chatId).then(async (result) => {
            if (!result)
                throw 'unable to find chat';
                
                return result;
            })
            chat.ChatMessages.push(saveMessageRequest._id)
            await chat.save()

        console.log(chat)
        var io = req.app.get('socketio');
        io.to(chat.ChatUser.toString()).emit('MESSAGE_SENT', saveMessageRequest)
        io.to(chat.ChatMentor.toString()).emit('MESSAGE_SENT', saveMessageRequest)

        return res.json({
            success: true,
            payload: saveMessageRequest,
            message: 'Message Successfully saved'
        })

    }
    catch(error){
        console.log(error.stack)
        return res.json({
            success: false,
            payload: null,
            message:error
        }); 
    }

    //save message


}

