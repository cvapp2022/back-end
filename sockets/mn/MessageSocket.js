const MessageModel = require('../../models/mn/Session/SessionMessage')
const SessionModel = require('../../models/mn/Meet/MeetSession')



module.exports.MessageSocket = function (io, socket) {


    socket.on('join', function (data) {
        socket.join(data.session);
        console.log('socket joined')
    })

    socket.on('SEND_MESSAGE', async function (data) {

        var saveMessage = new MessageModel();
        saveMessage.MessageSender = data.from;
        saveMessage.MessageSession = data.sessionId;
        saveMessage.MessageValue = data.value;
        if (data.from === 'user') {
            saveMessage.MessageUser = data.senderId;
        }
        else {
            saveMessage.MessageMentor = data.senderId;
        }

        saveMessage.save(function (err, result) {

            if (!err && result) {

                //find and push message to sessionMessages array 
                SessionModel.findById(data.sessionId,function(err2,result2){

                    if(!err2 && result2){
                        result2.SessionMessage.push(result._id)
                        result2.save()
                        io.to(data.sessionId).emit('MESSAGE_SENT', result)
                    }
                })

            }
        })

    });


};
