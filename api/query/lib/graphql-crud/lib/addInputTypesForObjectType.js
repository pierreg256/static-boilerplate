"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addInputTypesForObjectType = exports.createInputField = void 0;
var graphql_1 = require("graphql");
var _1 = require("./");
var createInputField = function (field, inputType) {
    // Create an input field based on the original field's type.
    // If the field is non nullable or a list then it needs to be wrapped with the correct class.
    var type = field.type instanceof graphql_1.GraphQLList ? new graphql_1.GraphQLList(inputType) : inputType;
    if (_1.isNonNullable(field)) {
        type = new graphql_1.GraphQLNonNull(type);
    }
    var inputField = {
        name: inputType.name,
        type: type,
    };
    return inputField;
};
exports.createInputField = createInputField;
var addInputTypesForObjectType = function (_a) {
    var objectType = _a.objectType, schema = _a.schema, _b = _a.prefix, prefix = _b === void 0 ? "" : _b, _c = _a.modifyField, modifyField = _c === void 0 ? function (field, parent) { return field; } : _c, _d = _a.parent, parent = _d === void 0 ? null : _d;
    // Fields of an input type cannot have resolvers
    var fields = _1.omitResolvers(objectType.getFields());
    // Create the corresponding input type.
    // For example, if given `type Foo` will create `input FooInputType`
    var inputObjectType = new graphql_1.GraphQLInputObjectType({
        name: "" + prefix + _1.toInputObjectTypeName(objectType.name),
        fields: fields,
    });
    // Adds the newly created input type to the type map.
    //
    // Note: the GraphQLObjectType fields of the input type have not yet been replaced.
    // However we need a reference to the input type added to the type map for lookups during recursion.
    schema.getTypeMap()[inputObjectType.name] = inputObjectType;
    // Iterate over each field in the input type.
    // If the field's type is not a GraphQLObjectType or a GraphQLList then it is copied as is.
    // If the field's type is a GraphQLObjectType or a GraphQLList
    //  Get the type which the GraphQLList contains
    //  Find (or create if not found) the corresponding input type
    //  Replace the field's type with the input type
    var inputObjectFields = Object.keys(fields).reduce(function (res, key) {
        var _a;
        var field = fields[key];
        if (!_1.isValidInputFieldType(field.type)) {
            // Check if the input type already exists
            // const inputType = getInputType(
            //   `${prefix}${getNamedType(field.type).name as string}`,
            //   schema
            // );
            var inputType = _1.getInputType("" + prefix + field.type.name, schema);
            if (inputType) {
                field = exports.createInputField(field, inputType);
            }
            else {
                // Input type does not exist so we need to create it
                //const fieldType = getNamedType(field.type);
                var newInputType = exports.addInputTypesForObjectType({
                    objectType: field.type,
                    schema: schema,
                    prefix: prefix,
                    modifyField: modifyField,
                    parent: objectType,
                });
                field = exports.createInputField(field, newInputType);
            }
        }
        return __assign(__assign({}, res), (_a = {}, _a[key] = modifyField(field, parent), _a));
    }, {});
    // Replace our original inputObjectType with new one containing the modified fields
    inputObjectType = new graphql_1.GraphQLInputObjectType({
        name: inputObjectType.name,
        fields: inputObjectFields,
    });
    schema.getTypeMap()[inputObjectType.name] = inputObjectType;
    return inputObjectType;
};
exports.addInputTypesForObjectType = addInputTypesForObjectType;
//# sourceMappingURL=addInputTypesForObjectType.js.map