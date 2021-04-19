const { CRUD_PERMISSION } = require('./constant')
const url = require("url");
const {ObjectID} = require("mongodb");

/**
 * 
 * 
  apikeys: {
 	[$key]: {
 		domains: [],
 		collection: {
 			[$collection]: ['create', 'read', 'update', 'delete']
 		},
 		roles: ['admin', ...]
 	}
  },
  
  roles: {
  	[$role]: {
  		collection: {
  			[$collection]: ['create', 'read', 'update', 'delete']
  		}
  	},
  }
 	
 }
 */

class CoCreatePermission {
	constructor(db_client) {
		this.permissions = new Map();
		this.dbClient = db_client
	}
	
	setPermissionOfKey(apikey, permission) {
		this.permissions.set(apikey, permission)
	}
	
	async getRolesByKey(apikey, organization_id) {
		if (this.permissions.get(apikey)) {
			return this.permissions.get(apikey)
		} else {
			
			//. get permissions from db
			//. we should add the code to get permissions from db by apikey
			//. Notes: now we are using mock data
			//. mockData = /** PermissionData **/
			//. how do we query the permissiondata... what is the order of operation? 
				//  apikey=> domains=> collections => roles = true/false response
				//. if user_id/token => domain => colections => roles = true
			//. merget roles collection and permission collection
			
			let permission = {};
			if (this.dbClient) {
				permission = await this.getPermissionOfapikey(apikey, organization_id);
			}

			this.permissions.set(apikey, permission)
			return permission
		}
	}
	
	getParameters(action, data) {
		const { apiKey, organization_id, collection } = data;
		return {
			apikey: apiKey,
			organization_id,
			key: 'collections',
			key_value: collection,
			type: action
		}
		
	}
	
	async check(action, data, { headers }) {
		const origin =  headers['origin']
		
		let host = headers['x-forwarded-for'];
		if (origin) {
			host = url.parse(origin).hostname;
		}
		
		const { apikey, organization_id, key, key_value, type } = this.getParameters(action, data)
		
		const permission = await this.getRolesByKey(apikey, organization_id)
		
		console.log(apikey, organization_id, key, key_value, type)
		return true;
		
		if (action == 'connect') return true;
		
		if (!apikey || !organization_id ) {
			return false;
		}
		
		if (permission.organization_id !== organization_id) {
			return false;
		}
		
		if (!permission.hosts || this.checkValue(permission.hosts, host)) {
			return false;
		}
		
		if (!permission[key]) return false

		let status = this.checkCollection(permission[key], key_value, type)

		return status;
	}
	
	async getPermissionOfapikey(key, organization_id) {
		
		try {
			if (!organization_id) {
				return null;
			}

			const db = this.dbClient.db(organization_id)
			if (!db)  {
				return null;
			}
			const collection = db.collection('permissions');
			if (!collection) {
				return null;
			}

			let permission = await collection.findOne({
				apikey: key,
				type: 'apikey'
			});
			
			if (!permission.collections) {
				permission.collections = {};
			}

			if (permission && permission.roles) {
				const role_ids = permission.roles.map((x) => ObjectID(x));

				let roles = await collection.find({
					_id: { $in: role_ids }
				}).toArray()

				roles.map(role =>  {
					if (role.collections) {
						// role_collections = { ...role_collections, ...role.collections}
						for (const c in role.collections) {
							if (permission.collections[c]) {
								permission.collections[c] = [...new Set([...permission.collections[c], ...role_collections[c]])]
							}
						}
					}
				})
			}
			console.log(permission)
			
			return permission;
		} catch (error) {
			return null;
		}
		
	}
	
	async checkByKey(action, { apiKey, organization_id, securityKey, collection, ...rest }, {headers}) {
		const origin =  headers['origin']
		let host = headers['x-forwarded-for'];
		if (origin) {
			host = url.parse(origin).hostname;
		}

		const permission = await this.getRolesByKey(apiKey, organization_id)
		// console.log(permission)
		return true;


		if (action == 'connect') {
			return true;
		}
		
		if (!apiKey || !organization_id ) {
			return false;
		}
		
		if (!permission) {
			return false;
		}
		
		if (permission.organization_id != organization_id) {
			return false;
		}
		
		if (!permission.hosts || this.checkValue(permission.hosts, host)) {
			return false;
		}
		
		if (!permission.collections) return false

		let status = this.checkCollection(permission.collections, collection, action)
		if (!status) {
			status = this.checkCollection(permission.role_collections, collection, action);
		}
		return status;
	}
	
	checkCollection(collections, selected_collection, action) 
	{
		if (!collections) return false;
		
		let collection_roles = collections[selected_collection];
		if (collection_roles && collection_roles.length > 0) {
			let status = collection_roles.some(x => {
				if (CRUD_PERMISSION[x]) {
					return CRUD_PERMISSION[x].includes(action)
				} else {
					return x == action;
				}
			})
			return status;
		} else {
			return false;
		}
	}
	
	checkValue(items, value) {
		if (!items) return false;
		if (items.includes("*") || items.includes(value)) {
			return true;
		}
		return false;
	}
}
module.exports = CoCreatePermission

<<<<<<< HEAD


=======
>>>>>>> f4e4be01b732f965c9c72d4fa248fe550dbebf8d
