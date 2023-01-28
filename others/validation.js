const { validationResult, check, body } = require('express-validator')
const UserModel = require('../models/UserSchema');




//Save User Validation 
exports.SaveUserValidate = [

        check('FullNameI').notEmpty()
                .withMessage('User Full name  is required'),

        check('MailI').notEmpty()
                .withMessage('User Mail   is required'),

        check('MailI').isEmail()
                .withMessage('Mail Is Wrong'),

        body('MailI').custom(value => {

                return UserModel.findOne({ CVUserMail: value }).then(user => {
                        if (user) {
                                return Promise.reject('E-mail already in use');
                        }
                })

        }),

        check('PassI').notEmpty()
                .withMessage('Password Is Required'),

        check('PassI').isLength({ min: 6 })
                .withMessage('Pass Minimum length is 6'),

        check('PhoneI').isMobilePhone()
                .withMessage('Wrong Mobile Phone'),
]
//End Save User Validation


//User Login Validate 
exports.LoginUserValidate = [

        //User mail
        check('UserI').notEmpty()
                .withMessage('User Mail   is required'),

        check('UserI').isEmail()
                .withMessage('Mail Is Wrong'),

        //Password
        check('PassI').notEmpty()
                .withMessage('Password Is Required'),
];

//End User login Validate 

//Save Cv Validation
exports.CvValidate = [
        //Cv Name validate
        check('CvNameI').notEmpty()
                .withMessage('Cv Name is required'),

]
//End Save Cv Validation



//Save Cl Validation

exports.ClValidate = [
        //Cv Name validate
        check('ClNameI').notEmpty()
                .withMessage('Cl Name is required'),

]
//End Cl Validation


//Save Experience Validation
exports.ExpValidate = [
        //Exp Title validate
        check('ExpTitleI').notEmpty()
                .withMessage('Expreiance Title is required'),

        //Exp Description validation
        check('ExpDescI').notEmpty()
                .withMessage('Expreince Description Is Required'),

        //Exp Job Validation
        check('ExpJobI').notEmpty()
                .withMessage('Experience Job Is Required'),

        //Exp from Validation
        check('ExpFromI').notEmpty()
                .withMessage('Expreiance From Date Is Required'),

        // check('ExpFromI').isISO8601().toDate()
        // .withMessage('Invalid Experience From Date'),

        //Exp To Validation
        check('ExpToI').notEmpty()
                .withMessage('Experience To Date Is Required '),

        // check('ExpToI').isISO8601().toDate()
        // .withMessage('Invalid Experience to Date '),

        //Exp Skill Validation

        //Exp Cv validation
        check('ExpCvI').notEmpty()
                .withMessage('Experience Cv Required'),

]
//End Save Experience Validation


//Save Skill Validation
exports.SkillValidate = [

        //Skill Title Validation
        check('SkillTitleI').notEmpty()
                .withMessage('Skill Title is required'),

        //Skill Descreption Validation
        check('SkillDescI').notEmpty()
                .withMessage('Skill Descreption is required'),

        //Skill Value Validation 
        check('SkillValI').notEmpty()
                .withMessage('Skill Value is required'),

        check('SkillCvI').notEmpty()
                .withMessage('Skill Cv is required'),

]
//End Save Skill Validation


//Save Edu validation
exports.EduValidate = [
        //Edu Title validate
        check('EduTitleI').notEmpty()
                .withMessage('Education Title is required'),

        //Edu Descreption validation
        check('EduDescI').notEmpty()
                .withMessage('Education Description Is Required'),
        // //Edu Type validatione
        // check('EduTypeI').notEmpty()
        //         .withMessage('Education Type Is required'),
        //Edu At validation
        check('EduAtI').notEmpty()
                .withMessage('Education At Is Required'),
        //Edu from Validation
        check('EduFromI').notEmpty()
                .withMessage('Education From Date Is Required'),

        //Edu To Validation
        check('EduToI').notEmpty()
                .withMessage('Education To Date Is Required '),

        //Edu Cv validation
        check('EduCvI').notEmpty()
                .withMessage('Education Cv Required'),

        //Edu Skill Validation
        // check('EduSkillI').notEmpty()
        // .withMessage('Education Skill Is Required'),

]
//End Save Edu validatiom



//Save Reff validation start

exports.Refvalidate = [

        //Reff Name validate
        check('RefNameI').notEmpty()
                .withMessage('Reff Name is required'),

        //Reff job validation
        check('RefJobI').notEmpty()
                .withMessage('Reff Job Is Required'),

        //Reff mail Validation
        check('RefMailI').notEmpty()
                .withMessage('Reff Mail Is Required'),

        check('RefMailI').isEmail()
                .withMessage('Reff Mail Is Wrong'),

        //Reff Phone To Validation
        check('RefPhoneI').notEmpty()
                .withMessage('Reff Phone Is Required '),

        check('RefPhoneI').isMobilePhone()
                .withMessage('Reff Mobile Number Is Wrong'),
        check('RefAtI').notEmpty()
                .withMessage('Reff At Is Required'),
        check('RefCvI').notEmpty()
                .withMessage('Reff Cv is required'),

];
//Save Reff Validation End


//Projecct Validate

exports.ProjValidate = [

        check('ProjNameI').notEmpty()
                .withMessage('Project Name Is required'),

        check('ProjDescI').notEmpty()
                .withMessage('Project Descreption Is Required'),

        check('ProjDateI').notEmpty()
                .withMessage('Project Date is required'),

        check('ProjCvI').notEmpty()
                .withMessage('Project Cv is required'),

]
//End Project validate



//Organization validate

exports.OrgValidate = [
        check('OrgTitleI').notEmpty()
                .withMessage('Organization Title Is required'),

        check('OrgDescI').notEmpty()
                .withMessage('Organization Descreption Is Required'),

        check('OrgJobI').notEmpty()
                .withMessage('Organization Job Is Required'),

        check('OrgFromI').notEmpty()
                .withMessage('Organization From Date Is Required'),

        check('OrgToI').notEmpty()
                .withMessage('Organization To Date Is Required '),
        check('OrgCvI').notEmpty()
                .withMessage('Project Cv is required'),
]
//end organization validate


//Award validate
exports.AwValidate = [
        check('AwTitleI').notEmpty()
                .withMessage('Award Title Is required'),

        check('AwDescI').notEmpty()
                .withMessage('Award Descreption Is Required'),

        check('AwJobI').notEmpty()
                .withMessage('Award Job Is Required'),

        check('AwDateI').notEmpty()
                .withMessage('Award From Date Is Required'),
        check('AwCvI').notEmpty()
                .withMessage('Project Cv is required'),
]
//end Award validate

//start Contact update validation
exports.ContactValidate = [
        check('ContactNameI').notEmpty()
                .withMessage('Contact name Is required'),

        check('ContactValI').notEmpty()
                .withMessage('Contact value Is Required'),

        check('CvIdI').notEmpty()
                .withMessage('Cv Is Required'),

]
//end Contact update validation



//Start Mentroship Program Save Validation 
exports.MnProgramValidate = [
        check('progNameI').notEmpty()
                .withMessage('Program name Is required'),

        check('progDescI').notEmpty()
                .withMessage('Program Desc Is Required'),
        check('progMeetsNumI').notEmpty()
                .withMessage('Program Meets number Required'),

]
//End Mentroship Program Save Validation 

//Start Mentroship mentor Save Validation 
exports.MnMentorValidate = [
        check('mentorNameI').notEmpty()
                .withMessage('mentor name Is required'),

        check('mentorMailI').notEmpty()
                .withMessage('mentor mail Is Required'),

        check('mentorPhoneI').notEmpty()
                .withMessage('mentor phone Is Required'),

        check('mentorPassI').notEmpty()
                .withMessage('mentor password Is Required'),

        check('mentorDescI').notEmpty()
                .withMessage('mentor desc Is Required'),
]
//End Mentroship Program Save Validation

//start Template Save Validate 
exports.TemplateValidate = [
        check('templateNameI').notEmpty()
                .withMessage('template name is required'),
        check('templatePriceI').notEmpty()
                .withMessage('mentor mail Is Required'),
        check('templateDescI').notEmpty()
                .withMessage('template Desc Is Required'),
        check('templatePaidI').notEmpty()
                .withMessage('template status paid required'),
        check('templateForI').notEmpty()
                .withMessage('Template for is requred')

]
//End Template Save Validate 

//Start Mentroship Request save Validation
exports.MnRequestValidate = [

        check('requestTypeI').notEmpty()
                .withMessage('Request type Is required'),

        check('requestProgramIdI').notEmpty()
                .withMessage('Request Program id Is Required'),

        check('requestDatesI').notEmpty()
                .withMessage('Request  dates Is Required'),
]
//end Mentroship Request save Validation


//start mentorship meet save validation

exports.MnMeetValidate = [

        check('MeetDateI').notEmpty()
                .withMessage('Meet Date Is required'),
        check('MeetRequestIdI').notEmpty()
                .withMessage('Meet Request id Is required')
]
//end mentorship meet save validation


//start Blog Category Save Validation
exports.BlogCategoryValidate = [

        check('CategoryTitleI').notEmpty()
                .withMessage('Category Title Is required'),
        check('CategoryDescI').notEmpty()
                .withMessage('Category Descreption Is required')
]
//end Blog Category Save Validation

//start Blog Post Save Validation
exports.BlogPostValidate = [

        check('postTitleI').notEmpty()
                .withMessage('Post Title Is required'),
        check('postCategoryI').notEmpty()
                .withMessage('Post Category  Is required')
]
//end Blog Post Save Validation


//start Blog Post Child Save Validation

exports.BlogPostChild = [
        check('postTitleI').notEmpty()
                .withMessage('Post Title Is required'),
        check('postDescI').notEmpty()
                .withMessage('Post Descreption  Is required'),
        check('postThumbI').notEmpty()
                .withMessage('Post Thumbnail  Is required'),
        check('postBodyI').notEmpty()
                .withMessage('Post Body Is required'),
]
//end Blog Post Child Save Validation


//start program preparation save validation
exports.ProgramPreparationValidate = [
        check('prepNameI').notEmpty()
                .withMessage('preparation Title Is required'),
        check('perpMeetI').notEmpty()
                .withMessage('Perperation Meet  Is required'),
]

//start save Skill Repo form Validate
exports.SkillRepoValidate=[

        check('skillNameI').notEmpty()
                .withMessage('Skill name Is required'),
        check('skillDescI').notEmpty()
                .withMessage('Skill Description Is required'),
]

//start save position Repo form Validate 
exports.PositionRepoValidate=[

        check('positionNameI').notEmpty()
                .withMessage('position name Is required'),
        check('positionDescI').notEmpty()
                .withMessage('position Description Is required'),
]

exports.MessageValidate = [
        check('msgFromI').notEmpty()
                .withMessage('Message From Is required'),
        check('msgValueI').notEmpty()
                .withMessage('Message Value Is required'),
        check('msgSenderIdI').notEmpty()
                .withMessage('Message Sender Is required'),
]

exports.MeetRateValidate = [
        check('RateSelectionI').notEmpty()
                .withMessage('Rate Selection Is required'),
        check('RateSelection2I').notEmpty()
                .withMessage('Rate Selection 2 Is required'),
        check('RateDescI').notEmpty()
                .withMessage('Rate Descreption Is required'),
]

exports.PaymentValidate=[
        check('PhoneNumberI').notEmpty()
                .withMessage('Payment Phone Number Is required'),
        check('OpNumberI').notEmpty()
                .withMessage('Payment operation Number Is required')
]


exports.ServiceValidate=[
        check('servNameI').notEmpty()
                .withMessage('config Name Is required'),
        check('servDescI').notEmpty()
                .withMessage('config Value Is required'),
        check('servPriceI').notEmpty()
                .withMessage('config Sub Value Is required'),
]

exports.ConfigValidate=[
        check('configNameI').notEmpty()
                .withMessage('config Name Is required'),
        check('configValueI').notEmpty()
                .withMessage('config Value Is required'),
        check('configSubValI').notEmpty()
                .withMessage('config Sub Value Is required'),
        check('configDescI').notEmpty()
                .withMessage('config Desc Is required'),
]

exports.StripeReqValidate=[
        check('price').notEmpty()
                .withMessage('price Is required'),
        check('token_from_stripe').notEmpty()
                .withMessage('token_from_stripe Is required'),
        check('email').notEmpty()
                .withMessage('email Is required'),
]

exports.SrMessageValidate=[
        check('msgFromI').notEmpty()
                .withMessage('Message From Is required'),
        check('msgValueI').notEmpty()
                .withMessage('Message Value Is required'),
        check('msgSenderIdI').notEmpty()
                .withMessage('Message Sender Is required'),
]

exports.WithdrawValidate=[
        check('withdrawMethodI').notEmpty()
                .withMessage('Withdraw method Is required'),
        check('withdrawTargetI').notEmpty()
                .withMessage('Withdraw target Is required'),
        check('withdrawValueI').notEmpty()
                .withMessage('Withdraw value Is required'),
]