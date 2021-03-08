"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelDirective = void 0;
var graphql_1 = require("graphql");
var graphql_tools_1 = require("graphql-tools");
var lodash_1 = require("lodash");
var pluralize = require("pluralize");
var _1 = require("./");
var ModelDirective = /** @class */ (function (_super) {
    __extends(ModelDirective, _super);
    function ModelDirective() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ModelDirective.prototype.visitObject = function (type) {
        // TODO check that id field does not already exist on type
        // Add an "id" field to the object type.
        //
        type.getFields().id = {
            name: "id",
            type: graphql_1.GraphQLID,
            description: "Unique ID",
            args: [],
            resolve: graphql_1.defaultFieldResolver,
            isDeprecated: false,
            deprecationReason: undefined,
            extensions: undefined,
        };
        ["created", "modified", "created_by", "modified_by"].forEach(function (fieldName) {
            type.getFields()[fieldName] = {
                name: fieldName,
                type: graphql_1.GraphQLString,
                description: "automatically generated ",
                args: [],
                resolve: graphql_1.defaultFieldResolver,
                isDeprecated: false,
                deprecationReason: undefined,
                extensions: undefined,
            };
        });
        // Modify schema with input types generated based off of the given type
        this.addInputTypes(type);
        // Modify root Mutation type to add create, update, upsert, and remove mutations
        this.addMutations(type);
        // Modify root Query type to add "find one" and "find many" queries
        this.addQueries(type);
    };
    ModelDirective.prototype.addInputTypes = function (objectType) {
        // Generate corresponding input types for the given type.
        // Each field returning GraphQLObjectType in the given type will also
        // have input types generated recursively.
        _1.addInputTypesForObjectType({
            objectType: objectType,
            schema: this.schema,
            modifyField: function (field) {
                field.type = graphql_1.getNullableType(field.type);
                return field;
            },
        });
    };
    ModelDirective.prototype.visitNestedModels = function (_a) {
        var data = _a.data, type = _a.type, modelFunction = _a.modelFunction;
        return __awaiter(this, void 0, void 0, function () {
            var res, _b, _c, key, value, field, fieldType, foundObject, createdObjects, value_1, value_1_1, v, foundObject, e_1_1, e_2_1;
            var e_2, _d, e_1, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        res = {};
                        _f.label = 1;
                    case 1:
                        _f.trys.push([1, 15, 16, 17]);
                        _b = __values(Object.keys(data)), _c = _b.next();
                        _f.label = 2;
                    case 2:
                        if (!!_c.done) return [3 /*break*/, 14];
                        key = _c.value;
                        value = data[key];
                        field = graphql_1.getNamedType(type.getFields()[key]);
                        if (!field)
                            return [3 /*break*/, 13];
                        fieldType = graphql_1.getNamedType(field.type);
                        if (!(lodash_1.isPlainObject(value) && _1.hasDirective("model", fieldType))) return [3 /*break*/, 4];
                        return [4 /*yield*/, modelFunction(fieldType, value)];
                    case 3:
                        foundObject = _f.sent();
                        res[key] = foundObject;
                        _f.label = 4;
                    case 4:
                        if (!(Array.isArray(value) && value.every(function (v) { return lodash_1.isPlainObject(v); }))) return [3 /*break*/, 13];
                        createdObjects = [];
                        _f.label = 5;
                    case 5:
                        _f.trys.push([5, 10, 11, 12]);
                        value_1 = (e_1 = void 0, __values(value)), value_1_1 = value_1.next();
                        _f.label = 6;
                    case 6:
                        if (!!value_1_1.done) return [3 /*break*/, 9];
                        v = value_1_1.value;
                        return [4 /*yield*/, modelFunction(fieldType, v)];
                    case 7:
                        foundObject = _f.sent();
                        createdObjects.push(foundObject);
                        _f.label = 8;
                    case 8:
                        value_1_1 = value_1.next();
                        return [3 /*break*/, 6];
                    case 9: return [3 /*break*/, 12];
                    case 10:
                        e_1_1 = _f.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 12];
                    case 11:
                        try {
                            if (value_1_1 && !value_1_1.done && (_e = value_1.return)) _e.call(value_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 12:
                        res[key] = createdObjects;
                        _f.label = 13;
                    case 13:
                        _c = _b.next();
                        return [3 /*break*/, 2];
                    case 14: return [3 /*break*/, 17];
                    case 15:
                        e_2_1 = _f.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 17];
                    case 16:
                        try {
                            if (_c && !_c.done && (_d = _b.return)) _d.call(_b);
                        }
                        finally { if (e_2) throw e_2.error; }
                        return [7 /*endfinally*/];
                    case 17: return [2 /*return*/, res];
                }
            });
        });
    };
    ModelDirective.prototype.pluckModelObjectIds = function (data) {
        var _this = this;
        return Object.keys(data).reduce(function (res, key) {
            var _a, _b, _c;
            if (key === "id") {
                return __assign(__assign({}, res), (_a = {}, _a[key] = data[key], _a));
            }
            if (lodash_1.isPlainObject(data[key])) {
                return __assign(__assign({}, res), (_b = {}, _b[key] = _this.pluckModelObjectIds(data[key]), _b));
            }
            if (Array.isArray(data[key])) {
                return __assign(__assign({}, res), (_c = {}, _c[key] = data[key].map(function (value) { return _this.pluckModelObjectIds(value); }), _c));
            }
            return res;
        }, {});
    };
    ModelDirective.prototype.findQueryResolver = function (type) {
        var _this = this;
        return function (root, args, context) { return __awaiter(_this, void 0, void 0, function () {
            var initialData, results;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, context.directives.model.store.find({
                            where: args.where,
                            type: type,
                        })];
                    case 1:
                        initialData = _a.sent();
                        if (!initialData) {
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, Promise.all(initialData.map(function (data) { return __awaiter(_this, void 0, void 0, function () {
                                var nestedData;
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.visitNestedModels({
                                                type: type,
                                                data: data,
                                                modelFunction: function (type, value) { return __awaiter(_this, void 0, void 0, function () {
                                                    var found;
                                                    return __generator(this, function (_a) {
                                                        switch (_a.label) {
                                                            case 0: return [4 /*yield*/, this.findOneQueryResolver(type)(root, __assign(__assign({}, args), { where: value }), context)];
                                                            case 1:
                                                                found = _a.sent();
                                                                return [2 /*return*/, found];
                                                        }
                                                    });
                                                }); },
                                            })];
                                        case 1:
                                            nestedData = _a.sent();
                                            return [2 /*return*/, lodash_1.merge({}, data, nestedData)];
                                    }
                                });
                            }); }))];
                    case 2:
                        results = _a.sent();
                        return [2 /*return*/, results];
                }
            });
        }); };
    };
    ModelDirective.prototype.findOneQueryResolver = function (type) {
        var _this = this;
        return function (root, args, context) { return __awaiter(_this, void 0, void 0, function () {
            var rootObject, nestedObjects;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, context.directives.model.store.findOne({
                            where: args.where,
                            type: type,
                        })];
                    case 1:
                        rootObject = _a.sent();
                        if (!rootObject) {
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, this.visitNestedModels({
                                type: type,
                                data: rootObject,
                                modelFunction: function (type, value) {
                                    return _this.findOneQueryResolver(type)(root, __assign(__assign({}, args), { where: value }), context);
                                },
                            })];
                    case 2:
                        nestedObjects = _a.sent();
                        return [2 /*return*/, lodash_1.merge({}, rootObject, nestedObjects)];
                }
            });
        }); };
    };
    ModelDirective.prototype.createMutationResolver = function (type) {
        var _this = this;
        return function (root, args, context) { return __awaiter(_this, void 0, void 0, function () {
            var relatedObjects, objectIds, rootObject, mergedObjects;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _1.validateInputData({
                            data: args.data,
                            type: type,
                            schema: this.schema,
                        });
                        return [4 /*yield*/, this.visitNestedModels({
                                type: type,
                                data: args.data,
                                modelFunction: function (type, value) { return __awaiter(_this, void 0, void 0, function () {
                                    var found, createdObject;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                if (!value.id) return [3 /*break*/, 2];
                                                return [4 /*yield*/, this.findOneQueryResolver(type)(root, { where: { id: value.id } }, context)];
                                            case 1:
                                                found = _a.sent();
                                                return [2 /*return*/, found];
                                            case 2: return [4 /*yield*/, this.createMutationResolver(type)(root, __assign(__assign({}, args), { data: value }), context)];
                                            case 3:
                                                createdObject = _a.sent();
                                                return [2 /*return*/, createdObject];
                                        }
                                    });
                                }); },
                            })];
                    case 1:
                        relatedObjects = _a.sent();
                        objectIds = this.pluckModelObjectIds(relatedObjects);
                        return [4 /*yield*/, context.directives.model.store.create({
                                data: __assign(__assign({}, args.data), objectIds),
                                type: type,
                            })];
                    case 2:
                        rootObject = _a.sent();
                        mergedObjects = __assign(__assign({}, rootObject), relatedObjects);
                        return [2 /*return*/, mergedObjects];
                }
            });
        }); };
    };
    ModelDirective.prototype.updateResolver = function (type) {
        var _this = this;
        return function (root, args, context) { return __awaiter(_this, void 0, void 0, function () {
            var relatedObjects, objectIds, updated, rootObject, mergedObjects;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _1.validateInputData({
                            data: args.data,
                            type: type,
                            schema: this.schema,
                        });
                        return [4 /*yield*/, this.visitNestedModels({
                                type: type,
                                data: args.data,
                                modelFunction: function (type, value) { return __awaiter(_this, void 0, void 0, function () {
                                    var updated_1, foundObject;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                if (!value.id) return [3 /*break*/, 3];
                                                return [4 /*yield*/, this.updateResolver(type)(root, {
                                                        data: value,
                                                        where: {
                                                            id: value.id,
                                                        },
                                                        upsert: false,
                                                    }, context)];
                                            case 1:
                                                updated_1 = _a.sent();
                                                if (!updated_1) return [3 /*break*/, 3];
                                                return [4 /*yield*/, this.findOneQueryResolver(type)(root, {
                                                        where: {
                                                            id: value.id,
                                                        },
                                                    }, context)];
                                            case 2:
                                                foundObject = _a.sent();
                                                return [2 /*return*/, foundObject];
                                            case 3: return [2 /*return*/, value];
                                        }
                                    });
                                }); },
                            })];
                    case 1:
                        relatedObjects = _a.sent();
                        objectIds = this.pluckModelObjectIds(relatedObjects);
                        return [4 /*yield*/, context.directives.model.store.update({
                                where: args.where,
                                data: __assign(__assign({}, args.data), objectIds),
                                upsert: args.upsert,
                                type: type,
                            })];
                    case 2:
                        updated = _a.sent();
                        if (!updated) {
                            throw new Error("Failed to update " + type);
                        }
                        return [4 /*yield*/, context.directives.model.store.findOne({
                                where: args.where,
                                type: type,
                            })];
                    case 3:
                        rootObject = _a.sent();
                        mergedObjects = __assign(__assign({}, rootObject), relatedObjects);
                        return [2 /*return*/, mergedObjects];
                }
            });
        }); };
    };
    // Helper function for adding mutations to the schema
    ModelDirective.prototype.addMutation = function (field, replaceExisting) {
        if (replaceExisting === void 0) { replaceExisting = false; }
        if (replaceExisting ||
            !this.schema.getMutationType().getFields()[field.name]) {
            this.schema.getMutationType().getFields()[field.name] = field;
        }
    };
    // Helper function for adding queries to the schema
    ModelDirective.prototype.addQuery = function (field, replaceExisting) {
        if (replaceExisting === void 0) { replaceExisting = false; }
        if (replaceExisting ||
            !this.schema.getQueryType().getFields()[field.name]) {
            this.schema.getQueryType().getFields()[field.name] = field;
        }
    };
    ModelDirective.prototype.addMutations = function (type) {
        var names = _1.generateFieldNames(type.name);
        // TODO add check to make sure mutation root type is defined and if not create it
        // create mutation
        this.addMutation({
            name: names.mutation.create,
            type: type,
            description: "Create a " + type.name,
            args: [
                {
                    name: "data",
                    type: this.schema.getType(names.input.type),
                },
            ],
            resolve: this.createMutationResolver(type),
            isDeprecated: false,
        });
        // update mutation
        this.addMutation({
            name: names.mutation.update,
            type: type,
            description: "Update a " + type.name,
            args: [
                {
                    name: "data",
                    type: _1.getInputType(type.name, this.schema),
                },
                {
                    name: "where",
                    type: _1.getInputType(type.name, this.schema),
                },
                {
                    name: "upsert",
                    type: graphql_1.GraphQLBoolean,
                },
            ],
            resolve: this.updateResolver(type),
            isDeprecated: false,
        });
        // remove mutation
        this.addMutation({
            name: names.mutation.remove,
            type: graphql_1.GraphQLBoolean,
            description: "Remove a " + type.name,
            args: [
                {
                    name: "where",
                    type: this.schema.getType(names.input.type),
                },
            ],
            resolve: function (root, args, context) {
                return context.directives.model.store.remove({
                    where: args.where,
                    type: type,
                });
            },
            isDeprecated: false,
        });
    };
    ModelDirective.prototype.addQueries = function (type) {
        var names = _1.generateFieldNames(type.name);
        // find one query
        this.addQuery({
            name: names.query.one,
            type: type,
            description: "Find one " + type.name,
            args: [
                {
                    name: "where",
                    type: this.schema.getType(names.input.type),
                },
            ],
            resolve: this.findOneQueryResolver(type),
            isDeprecated: false,
        });
        // find many query
        this.addQuery({
            name: names.query.many,
            type: new graphql_1.GraphQLList(type),
            description: "Find multiple " + pluralize.plural(type.name),
            args: [
                {
                    name: "where",
                    type: this.schema.getType(names.input.type),
                },
            ],
            resolve: this.findQueryResolver(type),
            isDeprecated: false,
        });
    };
    return ModelDirective;
}(graphql_tools_1.SchemaDirectiveVisitor));
exports.ModelDirective = ModelDirective;
//# sourceMappingURL=ModelDirective.js.map