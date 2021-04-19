module.exports = {
    apikeys: {
        'c2b08663-06e3-440c-ef6f-13978b42883a': {
            organization_id: '5de0387b12e200ea63204d6c',
            securityKey: 'f26baf68-e3a9-45fc-effe-502e47116265',
            domains: [],
            collection: {
                apples: ['create', 'read', 'update'],
                test: ['create', 'read', 'update']
            },
            roles: ['admin']
        }
    },
    roles: {
        admin: {
            collection: {
                test01: ['create', 'read', 'update']
            }
        },
        marketer: {
            collection: {}
        },
    }
}