const WithdrawRequestModel=require('../../../models/mentor/withdrawRequestSchema')
const TransactionModel=require('../../../models/mentor/transactionSchema')
const MentorModel=require('../../../models/MentorSchema')
const populate=require('../../../others/populations')
const facades=require('../../../others/facades')

exports.Get=function(req,res){




    //get withdraw requests
    WithdrawRequestModel.find({withdrawReqStatus:0},function(err,withdrawRequests){
        if(err){
            console.log(err)
            return res.send('unable to get withdraw requests')
        }
        return res.render('cpanel/mentors/withdrawRequests/list',{withdrawRequests})
    }).populate(populate.WithdrawRequestPopulate)

}


exports.Apply=async function(req,res){

    //validate params 
    var withdrawRequestId=req.params.withdrawRequestId;

    try{
        
        //get withdraw request
        var withdrawRequest=await WithdrawRequestModel.findById(withdrawRequestId).then((result)=>{
            if(!result)
                throw 'unable to find withdraw request ';
            else if(result.withdrawReqStatus===1)
                throw 'withdraw request already processed';
            return result;
        })

        //get mentor
        var mentor=await MentorModel.findById(withdrawRequest.withdrawReqMentor).then((result)=>{
            if(!result)
                throw 'unable to find mentor ';
            return result;
        })

        ///save withdraw transaction 
        var saveTransaction=new TransactionModel();
        saveTransaction.transactionType='withdraw';
        saveTransaction.transactionValue=withdrawRequest.withdrawReqValue;
        saveTransaction.transactionMentor=mentor._id;
        saveTransaction.transactionDesc="Withdraw to "+withdrawRequest.withdrawReqTarget+" via "+withdrawRequest.withdrawReqMethod;
        await saveTransaction.save();
        
        //push transaction to mentor 
        mentor.MentorTransaction.push(saveTransaction._id);
        await mentor.save();


        //update withdraw request status 
        withdrawRequest.withdrawReqStatus=1;
        await withdrawRequest.save();

        var io = req.app.get('socketio');
        //send notification 
        facades.saveNotif('mentor', mentor._id.toString(), 'RedirectToPayments', 'notifWithdrawRequestApplied', {}, true, io)

        //trigger mentor 
        var io = req.app.get('socketio');
        io.to(mentor._id.toString()).emit('WITHDRAW_REQUEST_APPLIED',{withdrawRequest,transaction:saveTransaction})
        
        
        return res.send('withdraw request successfully applied')

    }
    catch(error){
        console.log(error.stack)
       return  res.send(error)
    }





}