import {
  Store,
  StoreCreateProps,
  StoreCreateReturn,
  StoreFindOneProps,
  StoreFindOneReturn,
  StoreFindProps,
  StoreFindReturn,
  StoreRemoveProps,
  StoreRemoveReturn,
  StoreUpdateProps,
  StoreUpdateReturn,
} from "./";
import { cloneDeep } from "lodash";
import { CosmosClient /*, User*/ } from "@azure/cosmos";
import { createHash } from "crypto";

export interface CosmosStoreOptions {
  endpoint: string;
  key: string;
  databaseName: string;
  containerName: string;

  options?: object;
}

export class CosmosStore implements Store {
  public client;
  private options: CosmosStoreOptions;

  constructor(options: CosmosStoreOptions) {
    this.client = new CosmosClient(options);
    this.options = options;
    console.log("CosmosDB Store initialized");
  }
  public async findOne(props: StoreFindOneProps): Promise<StoreFindOneReturn> {
    /*const res = await this.db[props.type.name].findOne(
      this.formatInput(props.where)
    );
    */
    console.log("find one:", props);
    console.log("find one:", this.formatInput(props.where, props.type));
    const res = await this.find(props);
    return res && res.length > 0 && this.formatOutput(res[0]);
  }
  public async find(props: StoreFindProps): Promise<[StoreFindReturn]> {
    /*const res = await this.db[props.type.name].find(
      this.formatInput(props.where)
    );*/
    console.log("find:", props);
    console.log("find:", this.formatInput(props.where, props.type));

    const { database } = await this.client.databases.createIfNotExists({
      id: this.options.databaseName,
    });
    const { container } = await database.containers.createIfNotExists({
      id: this.options.containerName,
    });
    let query = `SELECT * from c `;
    let where = this.formatInput(props.where, props.type);
    const filter = Object.keys(where).map((key) => `c.${key}='${where[key]}'`);
    query += filter ? " where " + filter.join(" and ") : "";
    console.log("query:", query);
    const { resources } = await container.items.query(query).fetchAll();
    return this.formatOutput(resources);
  }
  public async create(props: StoreCreateProps): Promise<StoreCreateReturn> {
    const newItem = this.formatInput(props.data, props.type);
    console.log("create:", this.options.options);
    console.log("Create:", props);
    console.log("Create:", newItem);

    const { database } = await this.client.databases.createIfNotExists({
      id: this.options.databaseName,
    });
    const { container } = await database.containers.createIfNotExists({
      id: this.options.containerName,
    });
    const currentUserId = this.createUid("User", {
      _typeId: this.options.options.clientPrincipal.userId,
    });
    newItem.created_by = currentUserId;
    newItem.created = new Date();
    newItem.modified_by = currentUserId;
    newItem.modified = new Date();
    const { resource: createdItem } = await container.items.create(newItem);
    return this.formatOutput(createdItem);
  }
  public async update(props: StoreUpdateProps): Promise<StoreUpdateReturn> {
    // const res = await this.db[props.type.name].update(
    //   this.formatInput(props.where),
    //   {
    //     $set: props.data,
    //   },
    //   {
    //     upsert: props.upsert,
    //   }
    // );
    // return res.n > 0;
    return true;
  }
  public async remove(props: StoreRemoveProps): Promise<StoreRemoveReturn> {
    //const newItem = this.formatInput(props.data, props.type);
    console.log("remove:", this.formatInput(props.where, props.type));
    console.log("remove:", props);
    const { database } = await this.client.databases.createIfNotExists({
      id: this.options.databaseName,
    });
    const { container } = await database.containers.createIfNotExists({
      id: this.options.containerName,
    });
    const res = await container
      .item(this.formatInput(props.where, props.type).id)
      .delete();
    console.log("res:", res);
    return false;
  }
  // Adds an `id` field to the output
  private formatOutput(object) {
    if (Array.isArray(object)) {
      return object.map((o) => this.formatOutput(o));
    }
    if (!object) {
      return null;
    }
    if (!object.id) {
      return object;
    }
    const clonedObject = cloneDeep(object);
    clonedObject.id = clonedObject._typeId;
    delete clonedObject._id;
    return clonedObject;
  }
  private formatInput(object, typeName) {
    if (!object) {
      return null;
    }
    const clonedObject = cloneDeep(object);
    if (object.id) clonedObject._typeId = object.id;
    if (object.id) clonedObject.id = this.createUid(typeName, clonedObject);
    clonedObject._typeName = typeName;
    //delete clonedObject.id;
    return clonedObject;
  }
  private createUid(typeName, item) {
    //console.log("typeName", typeName);
    //console.log("item", item);
    const hash = createHash("sha1");
    hash.update(String(typeName));
    hash.update(String(item._typeId));
    return hash.digest("hex");
  }
}
