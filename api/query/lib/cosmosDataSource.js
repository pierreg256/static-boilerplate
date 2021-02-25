const { DataSource } = require("apollo-datasource");
const { CosmosClient } = require("@azure/cosmos");
const { createHash } = require("crypto");

const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const databaseName = process.env.COSMOS_DB;
const containerName = process.env.COSMOS_CONTAINER;

class CosmosDataSource extends DataSource {
  constructor() {
    super();
  }

  /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests
   */
  initialize(config) {
    this.context = config.context;
    this.client = new CosmosClient({ endpoint, key });

    console.log("CosmosDB datasource initialized");
  }

  createUid(typeName, item) {
    //console.log("typeName", typeName);
    //console.log("item", item);
    const hash = createHash("sha1");
    hash.update(typeName);
    hash.update(String(item._typeId));
    return hash.digest("hex");
  }

  /**
   * User can be called with an argument that includes email, but it doesn't
   * have to be. If the user is already on the context, it will use that user
   * instead
   */
  async createItem({ typeName, item, user } = {}) {
    if (!user)
      throw new Error("a user is required to create on object in the DB");
    const { database } = await this.client.databases.createIfNotExists({
      id: databaseName,
    });
    const { container } = await database.containers.createIfNotExists({
      id: containerName,
    });
    item._typeName = typeName;
    item._typeId = item.id;
    item.id = this.createUid(typeName, item);
    item.created = new Date().toISOString();
    item.created_by = user.id;
    item.modified = new Date().toISOString();
    item.modified_by = user.id;
    const { resource } = await container.items.create(item);
    //console.log(resource);
    resource.id = resource._typeId;
    return resource;
  }

  async createOrUpdateUser({
    identityProvider,
    userId,
    userDetails,
    userRoles,
  }) {
    const id = `${identityProvider}-${userId}`;
    const user = await this.getItemById({ typeName: "User", id });
    if (user) return user;
    const item = {
      id,
      nick_name: userDetails,
      user_roles: userRoles,
    };
    const newUser = await this.createItem({
      typeName: "User",
      item,
      user: item,
    });
    return newUser;
  }

  async getItemById({ typeName, id } = {}) {
    console.log(typeName, id);
    const { database } = await this.client.databases.createIfNotExists({
      id: databaseName,
    });
    const { container } = await database.containers.createIfNotExists({
      id: containerName,
    });
    const dbId = this.createUid(typeName, { _typeId: id });
    const { resource } = await container.item(dbId).read();
    if (resource) {
      //console.log(resource);
      resource.id = resource._typeId;
    }
    return resource;
  }

  async getAllItems({ typeName } = {}) {
    const { database } = await this.client.databases.createIfNotExists({
      id: databaseName,
    });
    const { container } = await database.containers.createIfNotExists({
      id: containerName,
    });
    const query = `SELECT * from c WHERE c._typeName = '${typeName}'`;
    //console.log("query:", query);
    const { resources } = await container.items.query(query).fetchAll();
    return resources.map((resource) => {
      resource.id = resource._typeId;
      return resource;
    });
  }
}

module.exports = CosmosDataSource;
