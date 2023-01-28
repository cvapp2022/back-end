module.exports.ws = function ws(socket) {

   socket.on('SEND_MESSAGE', function (data) {
      console.log('message sent ', data)
   })


};