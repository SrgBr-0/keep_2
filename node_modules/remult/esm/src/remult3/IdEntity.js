import { __decorate, __metadata } from "tslib";
import { Fields } from './Fields.js';
import { EntityBase } from './RepositoryImplementation.js';
export class IdEntity extends EntityBase {
    id;
}
__decorate([
    Fields.uuid(),
    __metadata("design:type", String)
], IdEntity.prototype, "id", void 0);
