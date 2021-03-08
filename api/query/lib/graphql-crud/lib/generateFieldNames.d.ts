export declare const generateFieldNames: (name: any) => {
    input: {
        type: string;
        mutation: {
            create: string;
            remove: string;
            update: string;
        };
    };
    query: {
        one: any;
        many: any;
    };
    mutation: {
        create: string;
        remove: string;
        update: string;
    };
};
