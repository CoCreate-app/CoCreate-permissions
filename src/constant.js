module.exports.PERMISSION = {
    create: {
        value: 'create',
        actions: ['createDocument', 'createUser', 'createOrganization']
    },
    read:   {
        value: 'read',
        actions: ['readDocument', 'readDocumentList'] 
    },
    update: {
        value: 'update',
        actions: ['updateDocument']
    }, 
    delete: {
        value: 'delete',
        actions: ['deleteDocument']
    }
}