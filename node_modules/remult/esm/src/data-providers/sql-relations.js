import { dbNamesOf, } from '../filter/filter-consumer-bridge-to-sql-request.js';
import { getRelationFieldInfo } from '../remult3/relationInfoMember.js';
import { SqlDatabase } from './sql-database.js';
import { remult } from '../remult-proxy.js';
export function sqlRelations(forEntity) {
    return new Proxy({}, {
        get: (target, relationField) => new Proxy(new SqlRelationTools(forEntity, relationField), {
            get: (target, prop) => {
                if (prop == '$count')
                    return target.$count;
                if (prop == '$subQuery')
                    return target.$subQuery;
                if (prop == '$relations')
                    return target.___relations();
                if (prop == '$first')
                    return target.$first;
                return target.$fields[prop];
            },
        }),
    });
}
class SqlRelationTools {
    myEntity;
    relationField;
    constructor(myEntity, relationField) {
        this.myEntity = myEntity;
        this.relationField = relationField;
    }
    $count = (where) => {
        return this.$subQuery(() => 'count(*)', { where });
    };
    $first = (options) => {
        return new Proxy(this, {
            get: (target, prop) => {
                if (prop == '$subQuery')
                    return (what) => target.$subQuery(what, { ...options, first: true });
                if (prop == '$relations')
                    return this.___relations({ ...options, first: true });
                return target.$subQuery((fieldNamesOfToEntity) => fieldNamesOfToEntity.$dbNameOf(prop), { ...options, first: true });
            },
        });
    };
    $fields = new Proxy(this, {
        get: (target, field) => {
            return target.$subQuery((fieldNamesOfToEntity) => fieldNamesOfToEntity.$dbNameOf(field));
        },
    });
    $subQuery = async (what, options) => {
        const rel = getRelationFieldInfo(remult.repo(this.myEntity).fields.find(this.relationField));
        if (!rel)
            throw new Error(`${this.relationField} is not a relation`);
        const relFields = rel.getFields();
        const filters = [];
        const namesOfOtherTable = await dbNamesOf(rel.toEntity, {
            tableName: true,
        });
        const namesOfMyTable = await dbNamesOf(this.myEntity, { tableName: true });
        for (const key in relFields.fields) {
            if (Object.prototype.hasOwnProperty.call(relFields.fields, key)) {
                filters.push(`${namesOfOtherTable.$dbNameOf(key)} = ${namesOfMyTable.$dbNameOf(relFields.fields[key])}`);
            }
        }
        const otherTableFilter = await SqlDatabase.filterToRaw(remult.repo(rel.toEntity), 
        // eslint-disable-next-line
        options?.where, undefined, namesOfOtherTable);
        if (otherTableFilter)
            filters.push(otherTableFilter);
        let result = `
( SELECT ${await what(namesOfOtherTable)} 
  FROM ${namesOfOtherTable} 
  WHERE ${filters.join(' and ')}`;
        if (options?.orderBy) {
            result += `
  ORDER BY ${Object.keys(options.orderBy)
                .map((key) => `${namesOfOtherTable.$dbNameOf(key)} ${options.orderBy[key]}`)
                .join(', ')}`;
        }
        if (options?.first) {
            result += `
  LIMIT 1`;
        }
        return (result +
            `
)`);
    };
    ___relations(options) {
        return new Proxy(this, {
            get: (target, field) => {
                const rel1 = getRelationFieldInfo(remult.repo(this.myEntity).fields.find(this.relationField));
                return new Proxy(this, {
                    get: (target, field1) => {
                        return this.$subQuery(() => indent(sqlRelations(rel1.toEntity)[field][field1]), options);
                    },
                });
            },
        });
    }
}
export function sqlRelationsFilter(forEntity) {
    return new Proxy({}, {
        get: (target, relationField) => new SqlRelationFilter(forEntity, relationField),
    });
}
export class SqlRelationFilter {
    _tools;
    constructor(myEntity, relationField) {
        this._tools = new SqlRelationTools(myEntity, relationField);
    }
    some(where) {
        //many orms use some, every, none
        return SqlDatabase.rawFilter(async (c) => {
            return ('exists ' +
                (await this._tools.$subQuery(() => '1', {
                    where,
                    c,
                })));
        });
    }
}
function indent(s) {
    return s.then((s) => s
        .split('\n')
        .map((x) => '  ' + x)
        .join('\n'));
}
