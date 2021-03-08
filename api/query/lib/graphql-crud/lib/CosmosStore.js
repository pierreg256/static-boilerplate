"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CosmosStore = void 0;
var lodash_1 = require("lodash");
var cosmos_1 = require("@azure/cosmos");
var crypto_1 = require("crypto");
var CosmosStore = /** @class */ (function () {
    function CosmosStore(options) {
        this.client = new cosmos_1.CosmosClient(options);
        this.options = options;
        console.log("CosmosDB datasource initialized");
    }
    CosmosStore.prototype.findOne = function (props) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                /*const res = await this.db[props.type.name].findOne(
                  this.formatInput(props.where)
                );
                */
                console.log("find one:", props);
                console.log("find one:", this.formatInput(props.where, props.type));
                return [2 /*return*/, this.formatOutput(null)];
            });
        });
    };
    CosmosStore.prototype.find = function (props) {
        return __awaiter(this, void 0, void 0, function () {
            var database, container, query, where, filter, resources;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        /*const res = await this.db[props.type.name].find(
                          this.formatInput(props.where)
                        );*/
                        console.log("find:", props);
                        console.log("find:", this.formatInput(props.where, props.type));
                        return [4 /*yield*/, this.client.databases.createIfNotExists({
                                id: this.options.databaseName,
                            })];
                    case 1:
                        database = (_a.sent()).database;
                        return [4 /*yield*/, database.containers.createIfNotExists({
                                id: this.options.containerName,
                            })];
                    case 2:
                        container = (_a.sent()).container;
                        query = "SELECT * from c ";
                        where = this.formatInput(props.where, props.type);
                        filter = Object.keys(where).map(function (key) { return "c." + key + "='" + where[key] + "'"; });
                        query += filter ? " where " + filter.join(" and ") : "";
                        console.log("query:", query);
                        return [4 /*yield*/, container.items.query(query).fetchAll()];
                    case 3:
                        resources = (_a.sent()).resources;
                        return [2 /*return*/, this.formatOutput(resources)];
                }
            });
        });
    };
    CosmosStore.prototype.create = function (props) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log();
                // const res = await this.db[props.type.name].insert(props.data);
                // return this.formatOutput(res);
                return [2 /*return*/, this.formatOutput({})];
            });
        });
    };
    CosmosStore.prototype.update = function (props) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
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
                return [2 /*return*/, true];
            });
        });
    };
    CosmosStore.prototype.remove = function (props) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // const res = await this.db[props.type.name].remove(
                //   this.formatInput(props.where)
                // );
                // return res.n > 0;
                return [2 /*return*/, true];
            });
        });
    };
    // Adds an `id` field to the output
    CosmosStore.prototype.formatOutput = function (object) {
        var _this = this;
        if (Array.isArray(object)) {
            return object.map(function (o) { return _this.formatOutput(o); });
        }
        if (!object) {
            return null;
        }
        if (!object.id) {
            return object;
        }
        var clonedObject = lodash_1.cloneDeep(object);
        clonedObject.id = clonedObject._typeId;
        delete clonedObject._id;
        return clonedObject;
    };
    CosmosStore.prototype.formatInput = function (object, typeName) {
        if (!object) {
            return null;
        }
        var clonedObject = lodash_1.cloneDeep(object);
        if (object.id)
            clonedObject._typeId = object.id;
        if (object.id)
            clonedObject.id = this.createUid(typeName, clonedObject);
        clonedObject._typeName = typeName;
        //delete clonedObject.id;
        return clonedObject;
    };
    CosmosStore.prototype.createUid = function (typeName, item) {
        //console.log("typeName", typeName);
        //console.log("item", item);
        var hash = crypto_1.createHash("sha1");
        hash.update(String(typeName));
        hash.update(String(item._typeId));
        return hash.digest("hex");
    };
    return CosmosStore;
}());
exports.CosmosStore = CosmosStore;
//# sourceMappingURL=CosmosStore.js.map