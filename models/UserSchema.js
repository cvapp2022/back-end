const mongoose = require('mongoose'); 
const bcrypt = require('bcryptjs')
//Define a schema 
const Schema = mongoose.Schema;

const UserModel = new Schema({ 

    BlUserName: {type:String,min:8,required:true},
    BlUserPass:{type:String,min:8,required:true} ,
    BlFullName:{type:String,min:8,required:true},
    BlUserMail:{type:String,required:true},
    BlUserFrom:{type:String,required:true},
    BlUserStatus:{type:Number,default:0}, //Need Activation
    BlUserPlan:{type:Number,default:0}, // free Plan
    BlUserCv:[{type:mongoose.Schema.Types.ObjectId, ref: 'BLCV'}],
    BlUserCl:[{type:mongoose.Schema.Types.ObjectId, ref: 'BLCL'}],
    TemplateOrders:[{type:mongoose.Schema.Types.ObjectId, ref: 'BLTemplateOrder'}],
    ServiceOrders:[{type:mongoose.Schema.Types.ObjectId, ref:'BLServiceOrder'}],
    MNRequests:[{type:mongoose.Schema.Types.ObjectId, ref: 'MnRequest'}],
    SRRequests:[{type:mongoose.Schema.Types.ObjectId, ref: 'SrServRequest'}],
    UserNotif:[{type:mongoose.Schema.Types.ObjectId, ref: 'BLUserNotif'}],
});
      
 
UserModel.methods.encryptPassword = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);  
};

UserModel.methods.validPassword = function(password) {
	
  return bcrypt.compareSync(password, this.BlUserPass);  
};
      
      
      
module.exports = mongoose.model('BLUser', UserModel);
//exports.model('BLCVUser',UserModel);