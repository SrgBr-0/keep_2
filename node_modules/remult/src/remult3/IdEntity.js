"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdEntity = void 0;
var tslib_1 = require("tslib");
var Fields_js_1 = require("./Fields.js");
var RepositoryImplementation_js_1 = require("./RepositoryImplementation.js");
var IdEntity = /** @class */ (function (_super) {
    tslib_1.__extends(IdEntity, _super);
    function IdEntity() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    tslib_1.__decorate([
        Fields_js_1.Fields.uuid(),
        tslib_1.__metadata("design:type", String)
    ], IdEntity.prototype, "id", void 0);
    return IdEntity;
}(RepositoryImplementation_js_1.EntityBase));
exports.IdEntity = IdEntity;
