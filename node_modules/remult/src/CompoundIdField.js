"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompoundIdField = void 0;
var CompoundIdField = /** @class */ (function () {
    function CompoundIdField() {
        var columns = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            columns[_i] = arguments[_i];
        }
        this.options = {};
        this.readonly = true;
        this.allowNull = false;
        this.dbReadOnly = false;
        this.isServerExpression = false;
        this.key = '';
        this.caption = '';
        this.inputType = '';
        this.dbName = '';
        this.fields = columns;
    }
    CompoundIdField.prototype.apiUpdateAllowed = function (item) {
        throw new Error('Method not implemented.');
    };
    CompoundIdField.prototype.displayValue = function (item) {
        throw new Error('Method not implemented.');
    };
    CompoundIdField.prototype.includedInApi = function (item) {
        throw new Error('Method not implemented.');
    };
    CompoundIdField.prototype.toInput = function (value, inputType) {
        throw new Error('Method not implemented.');
    };
    CompoundIdField.prototype.fromInput = function (inputValue, inputType) {
        throw new Error('Method not implemented.');
    };
    CompoundIdField.prototype.getDbName = function () {
        return Promise.resolve('');
    };
    CompoundIdField.prototype.getId = function (instance) {
        var get = function (field) {
            return instance[field.key];
        };
        if (typeof instance === 'function') {
            get = instance;
        }
        var r = '';
        this.fields.forEach(function (c) {
            if (r.length > 0)
                r += ',';
            r += c.valueConverter.toJson(get(c));
        });
        return r;
    };
    Object.defineProperty(CompoundIdField.prototype, "valueConverter", {
        get: function () {
            throw new Error('cant get value converter of compound id');
        },
        enumerable: false,
        configurable: true
    });
    CompoundIdField.prototype.isEqualTo = function (value) {
        var result = {};
        var val = value.toString();
        var id = val.split(',');
        this.fields.forEach(function (c, i) {
            result[c.key] = c.valueConverter.fromJson(id[i]);
        });
        return result;
    };
    return CompoundIdField;
}());
exports.CompoundIdField = CompoundIdField;
