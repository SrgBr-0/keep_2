export class DefaultMigrationBuilder {
    code;
    wrapped;
    constructor(code, wrapped) {
        this.code = code;
        this.wrapped = wrapped;
    }
    async createTable(meta) {
        if (this.wrapped?.createTable) {
            await this.wrapped.createTable(meta);
        }
        else
            this.code.addComment('TODO: implement create table ' + meta.dbName);
    }
    async addColumn(meta, field) {
        if (this.wrapped?.addColumn) {
            await this.wrapped.addColumn(meta, field);
        }
        else
            this.code.addComment('TODO: implement add column ' + meta.dbName + '.' + field.dbName);
    }
    async removeTable(entityDbName) {
        if (this.wrapped?.removeTable) {
            await this.wrapped.removeTable(entityDbName);
        }
        else
            this.code.addComment('TODO: implement remove table ' + entityDbName);
    }
    async removeColumn(entityName, columnDbName) {
        if (this.wrapped?.removeColumn) {
            await this.wrapped.removeColumn(entityName, columnDbName);
        }
        else
            this.code.addComment('TODO: implement remove column ' + entityName + '.' + columnDbName);
    }
}
