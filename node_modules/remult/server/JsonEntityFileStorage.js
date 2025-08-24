"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonFileDataProvider = exports.JsonEntityFileStorage = void 0;
var tslib_1 = require("tslib");
var fs = tslib_1.__importStar(require("fs"));
var path = tslib_1.__importStar(require("path"));
var index_js_1 = require("../index.js");
var JsonEntityFileStorage = /** @class */ (function () {
    function JsonEntityFileStorage(folderPath) {
        this.folderPath = folderPath;
    }
    JsonEntityFileStorage.prototype.getItem = function (entityDbName) {
        var fn = path.join(this.folderPath, entityDbName) + '.json';
        if (fs.existsSync(fn)) {
            return fs.readFileSync(fn).toString();
        }
        return null;
    };
    JsonEntityFileStorage.prototype.setItem = function (entityDbName, json) {
        if (!fs.existsSync(this.folderPath)) {
            fs.mkdirSync(this.folderPath);
        }
        return fs.writeFileSync(path.join(this.folderPath, entityDbName) + '.json', json);
    };
    return JsonEntityFileStorage;
}());
exports.JsonEntityFileStorage = JsonEntityFileStorage;
var JsonFileDataProvider = /** @class */ (function (_super) {
    tslib_1.__extends(JsonFileDataProvider, _super);
    function JsonFileDataProvider(folderPath) {
        return _super.call(this, new JsonEntityFileStorage(folderPath), true) || this;
    }
    return JsonFileDataProvider;
}(index_js_1.JsonDataProvider));
exports.JsonFileDataProvider = JsonFileDataProvider;
