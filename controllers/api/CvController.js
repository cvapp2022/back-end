const { validationResult } = require('express-validator')
var ObjectId = require('mongoose').Types.ObjectId;
const { google } = require('googleapis');
const stream = require('stream');
// var pdf = require('html-pdf');
const puppeteer = require('puppeteer');
const path = require('path');
const CvModel = require('../../models/CvSchema');
const CvMetaModel = require('../../models/cv/CvMetaSchema')
const UserModel = require('../../models/UserSchema');
const ExpModel = require('../../models/cv/ExperienceSchema');
const EduModel = require('../../models/cv/EducationSchema');
const ContactModel = require('../../models/cv/ContactSchema')
const OrgModel = require('../../models/cv/OrganizationSchema');
const ProjModel = require('../../models/cv/ProjectSchema');
const ReffModel = require('../../models/cv/ReffernceSchema');
const SkillModel = require('../../models/cv/SkillSchema')
const AwModel = require('../../models/cv/AwSchema');
const facades = require('../../others/facades');
const population = require('../../others/populations')
const templateTranslate=require('../../others/templateText.json')






exports.Get = function (req, res, next) {

    var CvId = req.params.cvId;
    if (!ObjectId.isValid(CvId)) {
        return res.json({
            success: false,
            payload: null,
            msg: 'Param not valid'
        });
    }


    //get Cv
    CvModel.findById(CvId).populate(population.CvPopulate).exec(function (err, result) {

        if (!err && result) {

            res.json({
                success: true,
                payload: result,
                msg: 'Cv Successfuly Loaded'
            });
        }
        else {
            res.json({
                success: false,
                payload: null,
                msg: 'Unable to find Cv '
            });
        }
    })


}


exports.Save = function (req, res, next) {

    //validate inputs 
    const errors = validationResult(req);

    if (errors.errors.length > 0) {
        return res.json({
            success: false,
            payload: errors.errors,
            msg: 'Validation Error'
        });
    }

    //Create New CV
    var SaveCv = new CvModel();
    SaveCv.CVName = req.body.CvNameI;
    SaveCv.CVUId = req.user._id;
    SaveCv.externalModelType='BLCVUser';
    SaveCv.CVTemplate = '62b6f0b0b422b9bda6ee1b21';
    SaveCv.save(function (err, result) {
        console.log(err)
        if (result && !err) {

            //push cv id to user
            UserModel.findOne({ _id: req.user._id }, function (err2, result2) {

                if (result2 && !err2) {
                    result2['BlUserCv'].push(result._id)
                    result2.save();
                    var arr = [
                        {
                            key: 'facebook',
                            value: '',
                        },
                        {
                            key: 'twitter',
                            value: '',
                        },
                        {
                            key: 'github',
                            value: '',
                        },
                        {
                            key: 'linkedin',
                            value: ''
                        }

                    ]
                    facades.saveContact(arr, result._id);

                    //get cv list 
                    CvModel.find({ CVUId: req.user._id }, function (err3, result3) {

                        if (!err3 && result3) {
                            return res.json({
                                success: true,
                                payload:
                                {
                                    list: result3,
                                    item: result
                                }
                                ,
                                msg: 'Cv Successfully Saved'
                            });
                        }
                    })
                }
            })
        }
    })
}



exports.Update = async function (req, res) {

    //validate Inputs 
    const errors = validationResult(req);
    if (errors.errors.length > 0) {
        return res.json({
            success: false,
            payload: errors.errors,
            msg: 'Validation Error'
        });
    }

    var CvId = req.params.cvId;
    if (!ObjectId.isValid(CvId)) {
        return res.json({
            success: false,
            payload: null,
            msg: 'Param not valid'
        });
    }
    // positionI: "",
    // addressI: "",
    // fullNameI: "",
    // profileI: "",
    console.log(req.body)
    var Update = {
        CVName: req.body.CvNameI,
        CVFullName:req.body.fullNameI,
        CVProfile:req.body.profileI,
        CVAddress:req.body.addressI,
        CVPosition:req.body.positionI['value'],
    }

    await CvModel.findOneAndUpdate({ _id: CvId }, Update)
    .then((result)=>{
        //console.log(result)
        return res.json({
            success:true,
            payload:null,
            message:'Cv Successfully Updated' 
        });
    })
    .catch((err)=>{
        return res.json({
            success: false,
            payload: err,
            msg: 'Unable to update Cv'
        });
     })
    // if (!err && result) {
    //     console.log('updated')
    // }
    // else {
    // }

}

exports.Delete = function (req, res) {

    var CvId = new ObjectId(req.params.cvId);
    if (!ObjectId.isValid(req.params.cvId)) {
        return res.json({
            success: false,
            payload: null,
            msg: 'Param not valid'
        });
    }



    ExpModel.find({ CVId: CvId }, function (err, resss) {
        console.log('resss', resss)
        console.log('its woriking')
    })

    //Delete related Exp
    ExpModel.deleteMany({ CVId: CvId }, function (err) {
        console.log(err)
    })

    // //Delete related edu
    EduModel.deleteMany({ CVId: CvId }, function (err) {
        console.log(err)
    })

    // //Delete related proj
    ProjModel.deleteMany({ CVId: CvId }, function (err) {
        console.log(err)
    })

    // //Delete related contacts
    ContactModel.deleteMany({ CVId: CvId }, function (err) {
        console.log(err)
    })

    // //Delete related skills
    SkillModel.deleteMany({ CVId: CvId }, function (err) {
        console.log(err)
    })

    // //delete related org
    OrgModel.deleteMany({ CVId: CvId }, function (err) {
        console.log(err)
    })

    // //delete related reff
    ReffModel.deleteMany({ CVId: CvId }, function (err) {
        console.log(err)
    })

    // //delete related awards
    AwModel.deleteMany({ CVId: CvId }, function (err) {
        console.log(err)
    })

    // //delete related cv meta
    CvMetaModel.deleteMany({ CVId: CvId }, function (err) {
        console.log(err)
    })

    //remove Cv From User Arr
    CvModel.findByIdAndDelete(CvId, function (err, result) {

        if (!err && result) {

            UserModel.findOne({ _id: req.user._id }, function (err2, result2) {

                if (result2 && !err2) {
                    result2['BlUserCv'].pull(result._id)
                    result2.save();

                    //get list of cv
                    CvModel.find({ CVUId: req.user._id }, function (err3, result3) {

                        return res.json({
                            success: true,
                            payload: { list: result3 },
                            msg: 'Cv Successfully Deleted'
                        });

                    })


                }

            })

        }
        else {
            return res.json({
                success: false,
                payload: null,
                msg: 'unable to find cv'
            });
        }

    })

}


exports.SetImg = async function (req, res) {



    //validate param 
    var CvId = new ObjectId(req.params.cvId);
    if (!ObjectId.isValid(req.params.cvId)) {
        return res.json({
            success: false,
            payload: null,
            msg: 'Param not valid'
        });
    }

    //validate file input
    if (Object.keys(req.files).length > 0 && req.files.ImgI.length > 0) {

        //return res.send(req.files.ImgI[0].size <= 2046)

        if (req.files.ImgI[0].size >= 500000) {
            return res.json({
                success: false,
                payload: null,
                msg: 'max file size'
            });
        }

        if (
            req.files.ImgI[0].mimetype === 'image/jpeg' ||
            req.files.ImgI[0].mimetype === 'image/jpg' ||
            req.files.ImgI[0].mimetype === 'image/gif'
        ) {

            var oauth2Client = facades.googleAuth();
            const drive = google.drive({
                version: 'v3',
                auth: oauth2Client,
            });

            const bufferStream = new stream.PassThrough();
            bufferStream.end(req.files.ImgI[0].buffer);

            try {
                const response = await drive.files.create({
                    requestBody: {
                        name: 'hero.png', //file name
                        mimeType: 'image/png',
                    },
                    media: {
                        mimeType: 'image/png',
                        body: bufferStream,
                    },
                });

                //set file permision anyone can read 
                const setPermResponse = await drive.permissions.create({
                    requestBody: {
                        role: 'reader',
                        type: 'anyone'
                    },
                    fileId: response.data.id
                }).then((resp) => {

                    //save as Cv meta
                    var metaArr = [
                        {
                            key: 'profile-img',
                            value: response.data.id
                        }
                    ]

                    facades.saveCvMeta(metaArr, CvId)

                    return res.json({
                        success: true,
                        payload: null,
                        msg: 'profile image successfully Uploaded'
                    });

                });


            } catch (error) {
                //report the error message
                console.log(error.message);
                return res.json({
                    success: false,
                    payload: null,
                    msg: 'Unable to upload file'
                });
            }
        }
        else {
            return res.json({
                success: false,
                payload: null,
                msg: 'Unable to upload file wrong mimetype'
            });
        }
    } else {
        return res.json({
            success: false,
            payload: null,
            msg: 'file is required'
        });
    }
}


exports.ChangeSort = function (req, res) {

    //validate param
    var CvId = req.params.cvId;
    if (!ObjectId.isValid(CvId)) {
        return res.json({
            success: false,
            payload: null,
            msg: 'Param not valid'
        });
    }

    if (!req.body.SortI) {
        return res.json({
            success: false,
            payload: null,
            msg: 'validation error'
        });
    }

    //update sections sort
    CvModel.findOneAndUpdate({ _id: CvId }, { CvSections: req.body.SortI }, function (err, result) {

        if (!err && result) {

            //trigger user 
            var io = req.app.get('socketio');
            io.to(req.user._id.toString()).emit('SECTION_UPDATED', {})

            return res.json({
                success: true,
                payload: null,
                msg: 'Sections sort successfully updated'
            });
        }
    })
}

exports.AddSection = function (req, res) {

    //validate param
    var CvId = req.params.cvId;
    if (!ObjectId.isValid(CvId)) {
        return res.json({
            success: false,
            payload: null,
            msg: 'Param not valid'
        });
    }


    //validate inputs 
    if (!req.body.SectionNameI) {
        return res.json({
            success: false,
            payload: null,
            msg: 'Validation error'
        });
    }

    //get cv sections 
    CvModel.findById(CvId, function (err, result) {

        if (!err && result) {

            //check section is unique
            var oldMainSections = result.CvSections.main
            var oldSideSections = result.CvSections.side
            var oldSections = [oldMainSections, oldSideSections].flat();
            oldSections.find((item) => {
                if (item.name === req.body.SectionNameI) {
                    return res.json({
                        success: false,
                        payload: null,
                        msg: 'Section Already in use'
                    });
                }
            });

            var newSection = { name: req.body.SectionNameI }
            var combineSections = [
                oldMainSections,
                newSection
            ]
            var newMainSections = combineSections.flat();

            result.CvSections = { 'main': newMainSections, 'side': oldSideSections };
            result.save(function (err2, result2) {

                //trigger user 
                var io = req.app.get('socketio');
                io.to(req.user._id.toString()).emit('SECTION_UPDATED', {})

                if (!err2 && result2) {
                    return res.json({
                        success: true,
                        payload: result2,
                        msg: 'Section Successfully updated'
                    });
                }
                // else {
                //     // return res.json({
                //     //     success: false,
                //     //     payload: null,
                //     //     msg: 'Unable to update section'
                //     // });
                // }

            });

        }

    })
}

exports.RemoveSection = function (req, res) {


    //validate param
    var CvId = req.params.cvId;
    if (!ObjectId.isValid(CvId)) {
        return res.json({
            success: false,
            payload: null,
            msg: 'Param not valid'
        });
    }


    //validate inputs 
    if (!req.body.SectionNameI) {
        return res.json({
            success: false,
            payload: null,
            msg: 'Validation error'
        });
    }

    //get cv sections 
    CvModel.findById(CvId, function (err, result) {

        if (!err && result) {

            var newSection={
                main:result.CvSections.main.filter((item)=>item.name !== req.body.SectionNameI),
                side:result.CvSections.side.filter((item)=>item.name !== req.body.SectionNameI)
            }
            result.CvSections = newSection;
            result.save(function (err2, result2) {
                if (!err2 && result2) {

                    //trigger user 
                    var io = req.app.get('socketio');
                    io.to(req.user._id.toString()).emit('SECTION_UPDATED', {})

                    return res.json({
                        success: true,
                        payload: result2,
                        msg: 'Section Successfully updated'
                    });
                }
                else{
                    return res.json({
                        success: false,
                        payload: null,
                        msg: 'unable to update cv section'
                    });
                }
            })
        }
        else {
            return res.json({
                success: false,
                payload: null,
                msg: 'unable to find cv'
            });
        }
    })
}


exports.SetTemplate = function (req, res) {


    //validate param 
    var CvId = new ObjectId(req.params.cvId);
    if (!ObjectId.isValid(req.params.cvId)) {
        return res.json({
            success: false,
            payload: null,
            msg: 'Param not valid'
        });
    }

    //validate input
    var newTemplate = req.body.TemplateIdI;
    if (!newTemplate || !ObjectId.isValid(newTemplate)) {
        return res.json({
            success: false,
            payload: null,
            msg: 'Template is required'
        });
    }

    CvModel.findOneAndUpdate({ _id: CvId }, { CVTemplate: newTemplate },{new: true}, function (err, result) {

        if (!err && result) {
            return res.json({
                success: true,
                payload: result,
                msg: 'Cv Template Successfully updated'
            });
        }
    }).populate(population.CvPopulate)
}


exports.SetLang=function(req,res){
    
    //validate param 
    var CvId = new ObjectId(req.params.cvId);
    if (!ObjectId.isValid(CvId)) {
        return res.json({
            success: false,
            payload: null,
            msg: 'Param not valid'
        });
    }
    //validate input
    var newLang = req.body.LangI;
    if (!newLang) {
        return res.json({
            success: false,
            payload: null,
            msg: 'lang is required'
        });
    }

    CvModel.findOneAndUpdate({ _id: CvId }, { CVLang: newLang },{new: true}, function (err, result) {

        if (!err && result) {
            return res.json({
                success: true,
                payload: result,
                msg: 'Cv Language Successfully updated'+newLang
            });
        }
    }).populate(population.CvPopulate)
}


exports.Render = function (req, res) {

    //validate param 
    var CvId = new ObjectId(req.params.cvId);
    if (!ObjectId.isValid(CvId)) {
        return res.json({
            success: false,
            payload: null,
            msg: 'Param not valid'
        });
    }

    CvModel.findOne({ _id: CvId }, function (err, result) {
        if(err || !result){
            return res.json({
                success: false,
                payload: null,
                msg: 'Param not valid'
            });
        }
        else {
            return res.render('templates/cv/' + result.CVTemplate.TemplateName + '/'+result.CVLang+'.pug', { cv: result,lang:result.CVLang,translate:templateTranslate },
                //generator start 
                (async (err, html) => {
                    console.log(err)
                    try {
                        // launch a new chrome instance
                        const browser = await puppeteer.launch({
                            headless: true,
                            // executablePath:'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
                        })
        
                        // create a new page
                        const page = await browser.newPage()
                        
                        var pathOfBase=path.join(__dirname, '../../public','empty.html');
                        // path.join(__dirname, 'dist', `${randomName}.html`);
                        await page.goto(`file://${pathOfBase}`);
                        await page.setContent(html, {
                            waitUntil: 'networkidle2'
                        })
                        // await page.goto(`data:text/html,${html}`, { waitUntil: 'networkidle0' });
        
                        // await page.setRequestInterception(true);
                        // page.on('request', (request) => {
                        //     if (['image', 'stylesheet', 'font', 'script'].indexOf(request.resourceType()) !== -1) {
                        //         request.abort();
                        //     } else {
                        //         request.continue();
                        //     }
                        // });
             
                        // create a pdf buffer
                        const pdfBuffer = await page.pdf({
                            format: 'A4',
                            printBackground: true,
                            width: '210mm',
                            height: '297mm'
                        })
        
                        res.set({
                            "Content-Type": "application/pdf",
                            "Content-Disposition": "attachment; filename=test.pdf"
                        });
                        
                        // close the browser
                        await browser.close()
                        
                        res.end(pdfBuffer)

                    } catch (error) {
                        console.log(error.stack)
                        return res.json({
                            success: false,
                            payload: null,
                            message:error
                        });
                    }

           
                })

                //generator end
            )
        }
    }).populate(population.CvPopulate)
}