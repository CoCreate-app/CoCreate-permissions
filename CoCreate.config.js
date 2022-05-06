module.exports = {
    config: {
        apiKey: "c2b08663-06e3-440c-ef6f-13978b42883a",
        securityKey: "f26baf68-e3a9-45fc-effe-502e47116265",
        organization_id: "5de0387b12e200ea63204d6c",
        host: "general.cocreate.app"
    },
 
    sources: [{
            path: "./docs/index.html",
            collection: "files",
            document_id: "",
            key: "html",
            data:{
                name: "permissions Doc",
            }
        },
    ],
   
    crud: [{
            collection: "routes",
            document_id: "",
            data:{
                collection: "files",
                document_id: "",
                name: "html",
                domains: ["*", "server.cocreate.app", "ws.cocreate.app"],
                route: "/docs/permissions",
            }
        }
    ],
    
    extract: {
        directory: "./src/",
        extensions: [
            "js",
            "css",
            "html"
        ],
        ignores: [
            "node_modules",
            "vendor",
            "bower_components",
            "archive"
        ],
    }
}
