exports.UserPopulate = [
{
    path: 'BlUserCv',
    populate: [
        {
            path: 'CVExp',
            options: { sort: { 'ExpSort': "ascending" } },
            populate: [
                {
                    path: 'ExpSkill'
                }
            ]
        },
        {
            path: 'CVSkill'
        },
        {
            path: 'CVEdu',
            options: { sort: { 'EduSort': "ascending" } },
            populate: [
                {
                    path: 'EduSkill'
                }
            ]
        },
        {
            path: 'CVProj',
            populate: [{
                path: 'ProjSkill'
            }],
            options: { sort: { 'ProjSort': "ascending" } },
        },
        {
            path: 'CVReff',
            options: { sort: { 'RefSort': "ascending" } },
        },
        {
            path: 'CVContact'
        },
        {
            path: 'CVOrg',
            options: { sort: { 'OrgSort': "ascending" } },
        },
        {
            path: 'CVAw',
            options: { sort: { 'AwSort': "ascending" } }
        },
        {
            path:'CVTemplate',
        },
        {
            path: 'CVImg'
        },
        {
            path:'CVPosition'
        }
    ]
},
{
    path: 'BlUserCl'
},
{
    path: 'MNRequests',
    populate:
        [
            {
                path: 'ReqProg',

                //model:'MnRequest'
            },
            {
                path: 'ReqMeets',
                populate: [
                    {
                        path: 'MeetSession',
                        populate:[
                            {
                                path:'SessionMessage'
                            },
                            {
                                path:'SessionAttachments'
                            }
                        ]
                    },
                    {
                        path:'MeetPrepare'
                    }

                ]

            }
        ]
},
{
    path:'SRRequests',
    populate:[
        {
            path:'ReqChat',
            populate:[
                {
                    path: 'ChatMessages'
                }
            ]
        }
    ]
},
{
    path:'UserNotif',
    options:{
        limit:6,
        sort: { 'createdAt': "descending" }
    } 
},
{
    path:'TemplateOrders'
},
{
    path:'ServiceOrders'
},


];


exports.RequestPopulation = [

    {
        path: 'ReqMentor'
    },
    {
        path: 'ReqProg'
    },
    {
        path: 'ReqMeets',
        populate:
        [
            {
                path: 'MeetSession',
                populate:[
                    {
                        path:'SessionMessage',
                    },
                    {
                        path:'SessionAttachments'
                    }
                ]
            },
            {
                path:'MeetPrepare'
            }
        ]
    }
];


exports.ServRequestPopulation = [

    {
        path: 'ReqMentor'
    },
    {
        path: 'ReqServ'
    },
    {
        path:'ReqCv'
    },
    {
        path:'ReqCl'
    },
    {
        path:'ReqUser'
    },
    {
        path:'ReqChat',
        populate:[
            {
                path: 'ChatMessages'
            }
        ]
    }
];

exports.ProgramPopulation = [
    {
        path: 'ProgMentors'
    },
    {
        path:'ProgPreparation'
    },
    {
        path:'ProgChilds'
    }
]

exports.MentorPopulation = [
    {
        path: 'MentorMnRequests'
    },
    {
        path:'MentorServRequests'
    },
    {
        path:'MentorWithdrawRequests'
    },
    {
        path:'MentorNotif',
        options:{limit:6}
    }
]

exports.CvPopulate = [

    {
        path: 'CVExp',
        options: { sort: { 'ExpSort': "ascending" } },
        populate: [
            {
                path: 'ExpSkill'
            }
        ]
    },
    {
        path: 'CVSkill'
    },
    {
        path: 'CVEdu',
        options: { sort: { 'EduSort': "ascending" } },
        populate: [
            {
                path: 'EduSkill'
            }
        ]
    },
    {
        path: 'CVProj',
        populate: [{
            path: 'ProjSkill'
        }],
        options: { sort: { 'ProjSort': "ascending" } },
    },
    {
        path: 'CVReff',
        options: { sort: { 'RefSort': "ascending" } },
    },
    {
        path: 'CVContact'
    },
    {
        path: 'CVOrg',
        options: { sort: { 'OrgSort': "ascending" } },
    },
    {
        path: 'CVAw',
        options: { sort: { 'AwSort': "ascending" } }
    },
    {
        path:'CVTemplate',
    },
    {
        path: 'CVImg'
    },
    {
        path:'CVPosition'
    }

]

exports.PostPopulate =[
    {
        path:'PostCategory'
    },
    {
        path:'PostChild',
    }
]

exports.ChatPopulate=[
    {
        path:'ChatMessages'
    },
    {
        path:'ChatMentor'
    },
    {
        path:'ChatUser'
    }
]

exports.WithdrawRequestPopulate=[
    {
        path:'withdrawReqMentor',
        populate:[
            {
                path:'MentorTransaction'
            }
        ]
    },
]