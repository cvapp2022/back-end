const TemplateModel = require('../../models/TemplateSchema')
const ConfigModel = require('../../models/ConfigSchema')
const ServiceModel = require('../../models/ServiceSchema')
const MnProgramModel = require('../../models/mn/MnProgramSchema')
const RepoPositionModel = require('../../models/repo/PositionRepoSchema')
const queryString = require('query-string')

module.exports.init = async function (req, res) {

    //validte params
    var lang = req.params.lang;

    //perpare google auth link
    const googlestringifiedParams = queryString.stringify({
        client_id: process.env.GOOGLE_CLI_ID,
        redirect_uri: process.env.GOOGLE_CLI_REDIRECT_URL,
        scope: [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
        ].join(' '), // space seperated string
        response_type: 'code',
    });

    //prepare github link
    const githubstringifiedParams = queryString.stringify({
        client_id: process.env.GITHUB_CLI_ID,
        redirect_uri: process.env.GITHUB_CLI_REDIRECT_URL,
        scope: ['user'].join(' '), // space seperated string
        allow_signup: true,
    });

    //prepare linkedin link
    const linkedinstringifiedParams = queryString.stringify({
        client_id: process.env.LINKEDIN_CLI_ID,
        redirect_uri: process.env.LINKEDIN_CLI_REDIRECT_URL,
        scope: [
            'r_emailaddress',
        ].join(' '), // space seperated string
        response_type: 'code',

    });

    //prepare facebook login link    
    const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${googlestringifiedParams}`;
    const githubLoginUrl = `https://github.com/login/oauth/authorize?${githubstringifiedParams}`;
    const linkedinLoginUrl = `https://www.linkedin.com/oauth/v2/authorization?${linkedinstringifiedParams}`;

    var socialLogin = {
        'google': googleLoginUrl,
        'github': githubLoginUrl,
        'linkedin': linkedinLoginUrl
    }
    var cvTemplates = [];
    var clTemplates = [];

    try {
        
            //get cv & cl templates 
            TemplateModel.find({ TemplateStatus: 1 }).exec(function (err, result) {
        
                if (!err && result) {
                    result.forEach((item) => {
                        if (item.TemplateFor === 'cv') cvTemplates.push(item)
                        else if (item.TemplateFor === 'cl') clTemplates.push(item)
                    })
                }
            })
        
            //get configs 
            var configs = await ConfigModel.find({}).then((result) => {
                return result;
            })
        
            //get services  SrServiceChild ServChilds
            var services= await ServiceModel.find({ ServStatus: 1 }).populate(
                [{
                    path: 'ServChilds',
                    match: { ChildLang: lang }
                }]
            ).then((result)=>{
                return result;
            })
            // var services = await ServiceModel.find({ ServStatus: 1 }).then((result) => {
            //     return result;
            // })
        
            // get mn programs
            var mnPrograms = await MnProgramModel.find({ ProgStatus: 1 }).populate([
                {
                    path: 'ProgMentors'
                },
                {
                    path: 'ProgPreparation'
                },
                {
                    path: 'ProgChilds',
                    match: { ChildLang: lang }
                }
            ]).then((result) => {
                return result;
            })
        
        
            return res.json({
                success: true,
                payload:
                {
                    socialLogin,
                    cvTemplates,
                    clTemplates,
                    configs,
                    services,
                    mnPrograms,
                
                },
                message: 'App init Successfuly loaded'
            })
    } catch (error) {
        console.log(error.stack)
        return res.json({
            success: false,
            payload:error.trace,
            message:'unable to load init '
        })
    }



}