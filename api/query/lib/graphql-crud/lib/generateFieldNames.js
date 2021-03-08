"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFieldNames = void 0;
var pluralize = require("pluralize");
var pascal_case_1 = require("pascal-case"); // tslint:disable-line no-var-requires
var camel_case_1 = require("camel-case"); // tslint:disable-line no-var-requires
var generateFieldNames = function (name) {
    var names = {
        input: {
            type: pluralize.singular(pascal_case_1.pascalCase(name)) + "InputType",
            mutation: {
                create: "Create" + pluralize.singular(pascal_case_1.pascalCase(name)) + "InputType",
                remove: "Remove" + pluralize.singular(pascal_case_1.pascalCase(name)) + "InputType",
                update: "Update" + pluralize.singular(pascal_case_1.pascalCase(name)) + "InputType",
            },
        },
        query: {
            one: pluralize.singular(camel_case_1.camelCase(name)),
            many: pluralize.plural(camel_case_1.camelCase(name)),
        },
        mutation: {
            create: "create" + pluralize.singular(pascal_case_1.pascalCase(name)),
            remove: "remove" + pluralize.singular(pascal_case_1.pascalCase(name)),
            update: "update" + pluralize.singular(pascal_case_1.pascalCase(name)),
        },
    };
    return names;
};
exports.generateFieldNames = generateFieldNames;
//# sourceMappingURL=generateFieldNames.js.map