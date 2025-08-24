"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValueConverters = void 0;
var tslib_1 = require("tslib");
var inputTypes_js_1 = require("../inputTypes.js");
var ValueConverters = /** @class */ (function () {
    function ValueConverters() {
    }
    ValueConverters.Date = {
        toJson: function (val) {
            if (val === null)
                return null;
            if (!val)
                return '';
            if (typeof val === 'string')
                val = new Date(val);
            if (val instanceof Date) {
                return val.toISOString();
            }
            else {
                throw new Error('Expected date but got ' + val);
            }
        },
        fromJson: function (val) {
            if (val === null)
                return null;
            if (val == undefined)
                return undefined;
            if (val == '')
                return undefined;
            if (val.startsWith('0000-00-00'))
                return undefined;
            return new Date(Date.parse(val));
        },
        toDb: function (x) { return x; },
        fromDb: function (val) {
            if (typeof val === 'number')
                val = new Date(val);
            if (typeof val === 'string')
                val = new Date(val);
            if (val && !(val instanceof Date))
                throw 'expected date but got ' + val;
            return val;
        },
        fromInput: function (x) { return ValueConverters.Date.fromJson(x); },
        toInput: function (x) { return ValueConverters.Date.toJson(x); },
        displayValue: function (val) {
            if (!val)
                return '';
            return val.toLocaleString();
        },
    };
    ValueConverters.DateOnly = {
        fromInput: function (x) { return ValueConverters.DateOnly.fromJson(x); },
        toInput: function (x) { return ValueConverters.DateOnly.toJson(x); },
        toJson: function (val) {
            var d = val;
            if (typeof d === 'string' || typeof d === 'number')
                d = new Date(d);
            if (d === undefined)
                return undefined;
            if (!d || d == null)
                return null;
            if (d.getHours() == 0)
                return new Date(d.valueOf() - d.getTimezoneOffset() * 60000)
                    .toISOString()
                    .substring(0, 10);
            else
                return d.toISOString().substring(0, 10);
        },
        fromJson: function (value) {
            if (!value || value == '' || value == '0000-00-00')
                return null;
            var d = new Date(Date.parse(value));
            d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
            return d;
        },
        inputType: inputTypes_js_1.InputTypes.date,
        toDb: function (val) {
            if (!val)
                return null;
            return ValueConverters.DateOnly.fromJson(ValueConverters.DateOnly.toJson(val));
        }, //when using date storage,  the database expects and returns a date local and every where else we reflect on date iso
        fromDb: function (val) {
            return ValueConverters.Date.fromDb(val);
        },
        fieldTypeInDb: 'date',
        displayValue: function (value) {
            if (!value)
                return '';
            return value.toLocaleDateString(undefined);
        },
    };
    ValueConverters.DateOnlyString = tslib_1.__assign(tslib_1.__assign({}, ValueConverters.DateOnly), { toDb: function (d) {
            var val = ValueConverters.DateOnly.toJson(d);
            if (!val)
                return undefined;
            return val.replace(/-/g, '');
        }, fromDb: function (val) {
            if (val === null)
                return null;
            if (!val)
                return undefined;
            return new Date(val.substring(0, 4) +
                '-' +
                val.substring(4, 6) +
                '-' +
                val.substring(6, 8));
        } });
    ValueConverters.Boolean = {
        toDb: function (val) { return val; },
        inputType: inputTypes_js_1.InputTypes.checkbox,
        fromDb: function (value) {
            return ValueConverters.Boolean.fromJson(value);
        },
        fromJson: function (value) {
            if (typeof value === 'boolean')
                return value;
            if (value === 1)
                return true;
            if (value !== undefined && value !== null) {
                return value.toString().trim().toLowerCase() == 'true';
            }
            return value;
        },
        toJson: function (x) { return x; },
        fromInput: function (x) { return ValueConverters.Boolean.fromJson(x); },
        toInput: function (x) { return ValueConverters.Boolean.toJson(x); },
    };
    ValueConverters.Number = {
        fromDb: function (value) {
            if (value === null)
                return null;
            if (value !== undefined)
                return +value;
            return undefined;
        },
        toDb: function (value) { return value; },
        fromJson: function (value) { return ValueConverters.Number.fromDb(value); },
        toJson: function (value) { return ValueConverters.Number.toDb(value); },
        fromInput: function (x, type) {
            var r = +x;
            if (x === null)
                return null;
            if (x === undefined)
                return undefined;
            return r;
        },
        toInput: function (x, type) {
            var _a;
            return (_a = x === null || x === void 0 ? void 0 : x.toString()) !== null && _a !== void 0 ? _a : '';
        },
        inputType: inputTypes_js_1.InputTypes.number,
    };
    ValueConverters.String = {
        fromDb: enforceString,
        toDb: enforceString,
        fromJson: enforceString,
        toJson: enforceString,
        fromInput: enforceString,
        toInput: enforceString,
    };
    ValueConverters.Integer = tslib_1.__assign(tslib_1.__assign({}, ValueConverters.Number), { toJson: function (value) {
            var val = ValueConverters.Number.toDb(value);
            if (!val)
                return val;
            return +(+val).toFixed(0);
        }, toDb: function (value) { return ValueConverters.Integer.toJson(value); }, fieldTypeInDb: 'integer' });
    ValueConverters.Default = {
        fromJson: function (x) { return x; },
        toJson: function (x) { return x; },
        fromDb: function (x) { return ValueConverters.JsonString.fromDb(x); },
        toDb: function (x) { return ValueConverters.JsonString.toDb(x); },
        fromInput: function (x) { return ValueConverters.Default.fromJson(x); },
        toInput: function (x) { return ValueConverters.Default.toJson(x); },
        displayValue: function (x) { return x + ''; },
        fieldTypeInDb: '',
        inputType: 'text',
    };
    ValueConverters.JsonString = {
        fromJson: function (x) { return x; },
        toJson: function (x) { return x; },
        fromDb: function (x) {
            return x == null
                ? null
                : x
                    ? JSON.parse(ValueConverters.JsonString.fromJson(x))
                    : undefined;
        },
        toDb: function (x) {
            return x !== undefined
                ? x === null
                    ? null
                    : JSON.stringify(ValueConverters.JsonString.toJson(x))
                : undefined;
        },
        fromInput: function (x) { return ValueConverters.JsonString.fromJson(x); },
        toInput: function (x) { return ValueConverters.JsonString.toJson(x); },
    };
    ValueConverters.JsonValue = {
        fromJson: function (x) { return x; },
        toJson: function (x) { return x; },
        fromDb: function (x) { return x; },
        toDb: function (x) { return x; },
        fromInput: function (x) { return ValueConverters.JsonString.fromJson(x); },
        toInput: function (x) { return ValueConverters.JsonString.toJson(x); },
        fieldTypeInDb: 'json',
    };
    return ValueConverters;
}());
exports.ValueConverters = ValueConverters;
function enforceString(value) {
    if (value === null || value === undefined)
        return value;
    if (typeof value !== 'string')
        return value.toString();
    return value;
}
