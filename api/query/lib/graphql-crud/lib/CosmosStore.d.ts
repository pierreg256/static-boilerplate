import { Store, StoreCreateProps, StoreCreateReturn, StoreFindOneProps, StoreFindOneReturn, StoreFindProps, StoreFindReturn, StoreRemoveProps, StoreRemoveReturn, StoreUpdateProps, StoreUpdateReturn } from "./";
export interface CosmosStoreOptions {
    endpoint: string;
    key: string;
    databaseName: string;
    containerName: string;
    options?: object;
}
export declare class CosmosStore implements Store {
    client: any;
    private options;
    constructor(options: CosmosStoreOptions);
    findOne(props: StoreFindOneProps): Promise<StoreFindOneReturn>;
    find(props: StoreFindProps): Promise<[StoreFindReturn]>;
    create(props: StoreCreateProps): Promise<StoreCreateReturn>;
    update(props: StoreUpdateProps): Promise<StoreUpdateReturn>;
    remove(props: StoreRemoveProps): Promise<StoreRemoveReturn>;
    private formatOutput;
    private formatInput;
    private createUid;
}
