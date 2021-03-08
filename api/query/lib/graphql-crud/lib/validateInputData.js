"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateInputData = void 0;
var graphql_1 = require("graphql");
var lodash_1 = require("lodash");
var _1 = require("./");
// For every null value in the input data
// check that it can be nullable by check the type definition.
var validateInputData = function (props) {
    if (lodash_1.isEmpty(props.data)) {
        throw new Error('data input object is missing');
    }
    var fields = props.type.getFields();
    Object
        .keys(fields)
        .forEach(function (key) {
        var field = fields[key];
        var value = props.data[key];
        // Encountered an input object within the data. Recursively call this function.
        if (lodash_1.isPlainObject(value)) {
            exports.validateInputData({
                schema: props.schema,
                data: value,
                type: graphql_1.getNullableType(field.type),
            });
        }
        else {
            // IF the field value provided is null and the field is non nullable
            // OR the field was not provided but is marked as non nullable in the input type
            if (value === null && _1.isNonNullable(field) || !props.data[key] && _1.isNonNullable(field)) {
                throw new Error(props.type.name + "." + field.name + " must not be null");
            }
        }
    });
};
exports.validateInputData = validateInputData;
//# sourceMappingURL=validateInputData.js.map