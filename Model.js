// default startup-model
Model = 
{
    name: "Home",
    settings:{
        includedLibraries:[
            // "lists"
        ],
        exports:[],
        dynamic:[],
        executionLimit:300
    },
    formatVersion: 0.2,
    pageIndexTree: 
    [/*
        {type: 'rules', index:0},
        {
            type: 'folder', name: 'Folder', children:
            [
                {type: 'rules', index:1}
            ]
        }
    */],
    dataTables: [
    ],
    rulePages: [/*
        {
            id: 0,
            name:"First page",
            shapes:[
                {
                    type:"RuleShape",
                    "id": 0,
                    "x": 400,
                    "y": 400,
                    data:{
                        libraryName: "",
                        ruleName: "test",
                        arguments: [
                            "atom",
                            "Variable"
                        ]
                    }
                }
            ],
            connections:[]
        },
        {
            id:1,
            name:"Second page",
            shapes:[
                {
                    type:"RuleShape",
                    "id": 0,
                    "x": 402,
                    "y": 205,
                    data:{
                        libraryName: "",
                        ruleName: "katt",
                        arguments: [
                            "E",
                            "List"
                        ]
                    }
                },
            ],
            connections: []
        },
    */]
};
