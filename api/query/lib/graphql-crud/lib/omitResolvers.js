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
exports.omitResolvers = void 0;
var lodash_1 = require("lodash");
var omitResolvers = function (fields) {
    return Object
        .keys(fields)
        .reduce(function (res, key) {
        var _a;
        var value = lodash_1.omitBy(fields[key], function (value, key) { return key === 'resolve'; });
        return __assign(__assign({}, res), (_a = {}, _a[key] = value, _a));
    }, {});
};
exports.omitResolvers = omitResolvers;
//# sourceMappingURL=omitResolvers.js.map