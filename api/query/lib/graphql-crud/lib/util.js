"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasDirective = exports.getObjectTypeFromInputType = exports.isNonNullable = exports.getInputType = exports.isValidInputFieldType = exports.toInputObjectTypeName = void 0;
var graphql_1 = require("graphql");
var lodash_1 = require("lodash");
var toInputObjectTypeName = function (name) {
    return name + "InputType";
};
exports.toInputObjectTypeName = toInputObjectTypeName;
var isValidInputFieldType = function (type) {
    return !(graphql_1.getNamedType(type) instanceof graphql_1.GraphQLObjectType);
};
exports.isValidInputFieldType = isValidInputFieldType;
var getInputType = function (typeName, schema) {
    var type = schema.getType(exports.toInputObjectTypeName(typeName));
    return type;
};
exports.getInputType = getInputType;
var isNonNullable = function (type) {
    return type.astNode && type.astNode.type.kind === "NonNullType";
};
exports.isNonNullable = isNonNullable;
var getObjectTypeFromInputType = function (typeName, schema) {
    var type = schema.getType(typeName.replace("InputType", ""));
    return type;
};
exports.getObjectTypeFromInputType = getObjectTypeFromInputType;
var hasDirective = function (directive, type) {
    var directives = lodash_1.get(type, ["astNode", "directives"]);
    if (directives) {
        return directives.find(function (d) { return d.name.value === directive; });
    }
    return false;
};
exports.hasDirective = hasDirective;
//# sourceMappingURL=util.js.map