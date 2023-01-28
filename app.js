const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan');
const dotenv = require('dotenv').config()
const pug = require('pug');
const path = require('path');
const app = express()
const port = process.env.PORT || 5000;

const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer,
  {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      transports: ['websocket', 'polling'],
      extraHeaders: {
        'Access-Control-Allow-Credentials': 'omit'
      }
    },
    allowEIO3: true
  }
);
const signalServer = require('simple-signal-server')(io)


//Require routes 
const AppRoutes = require('./routes/api/v1/AppRoutes')
const ValidationRoutes = require('./routes/api/v1/ValidationRoutes')

//cl
const ClRoutes = require('./routes/api/v1/ClRoutes')

//cv
const CvRoutes = require('./routes/api/v1/CvRoutes')
const ExpRoutes = require('./routes/api/v1/cv/ExpRoutes')
const EduRoutes = require('./routes/api/v1/cv/EduRoutes')
const SkillRoutes = require('./routes/api/v1/cv/SkRoutes')
const UserRoutes = require('./routes/api/v1/UserRoutes')
const ReffRoutes = require('./routes/api/v1/cv/RefRoutes')
const ProjRoutes = require('./routes/api/v1/cv/ProjRoutes')
const OrgRoutes = require('./routes/api/v1/cv/OrgRoutes')
const AwRoutes = require('./routes/api/v1/cv/AwRoutes')
const ContactRoutes = require('./routes/api/v1/cv/ContactRoutes')

//mn
const MnRequestRoutes = require('./routes/api/v1/mn/MnRequestRoutes')
const MnPorgramRoutes = require('./routes/api/v1/mn/ProgramRoutes')
const MnMeetRoutes = require('./routes/api/v1/mn/MeetRoutes')
const MnMeetSessionRoutes = require('./routes/api/v1/mn/meet/SessionRoutes')
const MnMeetRateRoutes=require('./routes/api/v1/mn/meet/RateRoutes')

//mentor
const MnMentorRoutes = require('./routes/api/v1/MentorRoutes')
const MentorWithdrawRoutes=require('./routes/api/v1/mentor/WithdrawRoutes')

//blog
const BlogPostRoutes = require('./routes/api/v1/blog/PostRoutes')

//repos
const RepoSkillRoutes = require('./routes/api/v1/repo/SkillRepoRoutes')
const RepoPositionRoutes=require('./routes/api/v1/repo/PositionRepoRoutes')

//template
const TemplateRoutes=require('./routes/api/v1/TemplateRoutes')

//services
const ServiceRoutes=require('./routes/api/v1/ServRoutes')
const SrRequstRoutes=require('./routes/api/v1/service/SrRequestRoutes')
const SrRequestCvRoutes=require('./routes/api/v1/service/request/SrRequestCvRoutes')
const SrRequestClRoutes=require('./routes/api/v1/service/request/SrRequestClRoutes')
const SrRequestMessageRoutes=require('./routes/api/v1/service/request/SrRequestMessageRoutes')

//chats 
const ChatMessageRoutes=require('./routes/api/v1/chat/MessageRoutes')


//cpanel routes 
const CpanelRoutes = require('./routes/cpanel/CpanelRoutes')
const CUsersRoutes = require('./routes/cpanel/CUsersRoutes')
const CMnProgramsRoutes = require('./routes/cpanel/CpMnRoutes/MnProgramRoutes')
const CMentorRoutes = require('./routes/cpanel/CMentorRoutes')
const CMentorWithdrawRequests=require('./routes/cpanel/CpMentorRoutes/CWithdrawRequestsRoutes')
const CTemplateRoutes = require('./routes/cpanel/CTemplateRoutes')
const CBlogCategoryRoutes = require('./routes/cpanel/CpBlogRoutes/BlogCategoryRoutes')
const CBlogPostRoutes = require('./routes/cpanel/CpBlogRoutes/BlogPostRoutes')
const CRepoSkillRoutes=require('./routes/cpanel/CpRepoRoutes/RepoSkillRoutes')
const CRepoPositionRoutes=require('./routes/cpanel/CpRepoRoutes/RepoPositionRoutes')
const CServicesRoutes=require('./routes/cpanel/CServicesRoutes')
const CPaymentsRoutes=require('./routes/cpanel/CPaymentsRoutes')
const CConfigsRoutes=require('./routes/cpanel/CConfigRoutes')

//sockets 
const MessageSocket = require('./sockets/mn/MessageSocket')

const facades = require('./others/facades')

const rooms = new Map()
signalServer.on('discover', (request) => {
  log('discover');
  let memberId = request.socket.id;
  let roomId = request.discoveryData;
  let members = rooms.get(roomId);
  if (!members) {
    members = new Set();
    rooms.set(roomId, members);
  }
  members.add(memberId);
  request.socket.roomId = roomId;
  request.discover({
    peers: Array.from(members)
  });
  log('joined ' + roomId + ' ' + memberId)
})

signalServer.on('disconnect', (socket) => {
  let memberId = socket.id;
  let roomId = socket.roomId;
  let members = rooms.get(roomId);
  if (members) {
    members.delete(memberId)
  }
  log('left ' + roomId + ' ' + memberId)
})
signalServer.on('request', (request) => {
  request.forward()
  log('requested')
})

function log(message, data) {
  if (true) {
    console.log(message);
    if (data != null) {
      console.log(data);
    }
  }
}


io.on('connection', function (socket) {


  socket.on('MENTOR_JOIN', function (data) {
    socket.join(data._id)
    console.log('mentor Joined socket',data._id)
    io.to(data._id).emit('MENTOR_JOINED')
  })


  socket.on('join', function (data) {
    socket.join(data.session);
    console.log('socket joined')
  })
  
  socket.on('leave',function(data){
    socket.leave(data.session)
  })

  socket.on('USER_JOIN', function (userId) {
    socket.join(userId)
    console.log('user joind scocket',userId)
    io.to(userId).emit('USER_JOINED')
  })

  socket.on('CLOSE_SESSION', async function(data){
    facades.closeSession(data.session,function(meet){
      io.to(meet.MeetRequest.ReqUser.toString()).emit('SESSION_CLOSED')
    })
  })


})

//   console.log('socket connectctd')
//   // app.set('io', io);
//   // MessageSocket.MessageSocket(io, socket)
//   //io2.ws(socket)
// })
//   app.set('socketio', io);
app.set('socketio', io);


//Body Parser Initialize
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Logger
app.use(morgan('dev'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug')
app.use(express.static(path.join(__dirname, 'public')));

//conect To MongoDB
var mongoDB = process.env.MONGOURL;
//var mongoDB='mongodb://127.0.0.1/BlaxkCV';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors) 
db.on('error', console.error.bind(console, 'MongoDB connection error:'));



//Use Routes
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, X-PINGOTHER, X-File-Name, Cache-Control, Content-Type, Accept, authorization");
  next();
});

//require('./others/test')();
app.get('/', function (req, res) {
  res.render('helloWorld', { message: 'Hello World!' });
  var sum = 0;
  rooms.forEach((v, k) => sum = sum + v.size);
  //res.send('Lobby server<br/>rooms: ' + rooms.size + '<br/>members: ' + sum);
});
app.use('/api/v1/', AppRoutes)
app.use('/api/v1/User/', UserRoutes)

app.use('/api/v1/Cl', ClRoutes)

app.use('/api/v1/Cv/Exp', ExpRoutes)
app.use('/api/v1/Cv/Edu', EduRoutes)
app.use('/api/v1/Cv/Skill', SkillRoutes)
app.use('/api/v1/Cv/Reff', ReffRoutes)
app.use('/api/v1/Cv/Proj', ProjRoutes)
app.use('/api/v1/Cv/Org', OrgRoutes)
app.use('/api/v1/Cv/Aw', AwRoutes)
app.use('/api/v1/Cv/Contact/', ContactRoutes)

app.use('/api/v1/Mentor', MnMentorRoutes)
app.use('/api/v1/Mentor/Withdraw',MentorWithdrawRoutes)

app.use('/api/v1/Mn/Request', MnRequestRoutes)
app.use('/api/v1/Mn/Program', MnPorgramRoutes)
app.use('/api/v1/Mn/Meet', MnMeetRoutes)
app.use('/api/v1/Mn/Session', MnMeetSessionRoutes)
app.use('/api/v1/Mn/Rate', MnMeetRateRoutes)

app.use('/api/v1/Template/',TemplateRoutes)

app.use('/api/v1/Service/Request/Message',SrRequestMessageRoutes)
app.use('/api/v1/Service/Request/Cv',SrRequestCvRoutes)
app.use('/api/v1/Service/Request/Cl',SrRequestClRoutes)
app.use('/api/v1/Service/Request',SrRequstRoutes)
app.use('/api/v1/Service',ServiceRoutes)

app.use('/api/v1/Chat/Message',ChatMessageRoutes)
app.use('/api/v1/blog/Post', BlogPostRoutes)

app.use('/api/v1/repo/Skill',RepoSkillRoutes)
app.use('/api/v1/repo/position',RepoPositionRoutes)


app.use('/api/v1/Validation', ValidationRoutes)

app.use('/api/v1/Cv', CvRoutes)

app.use('/Cpanel', CpanelRoutes)
app.use('/Cpanel/Users', CUsersRoutes)
app.use('/Cpanel/Mentorship/Programs', CMnProgramsRoutes)
app.use('/Cpanel/Mentors', CMentorRoutes)
app.use('/Cpanel/Mentors/Withdraw-requests',CMentorWithdrawRequests)
app.use('/Cpanel/Templates', CTemplateRoutes)
app.use('/Cpanel/Blog/Cat', CBlogCategoryRoutes)
app.use('/Cpanel/Blog/Post', CBlogPostRoutes)
app.use('/Cpanel/Repo/Skill',CRepoSkillRoutes)
app.use('/Cpanel/Repo/Position',CRepoPositionRoutes)
app.use('/Cpanel/Services',CServicesRoutes)
app.use('/Cpanel/Payments',CPaymentsRoutes)
app.use('/Cpanel/Configs',CConfigsRoutes)


//Server
httpServer.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})