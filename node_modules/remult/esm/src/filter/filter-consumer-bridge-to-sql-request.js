import { SqlDatabase } from '../data-providers/sql-database.js';
import { remult } from '../remult-proxy.js';
import { getEntityMetadata } from '../remult3/RepositoryImplementation.js';
import { getRelationFieldInfo } from '../remult3/relationInfoMember.js';
export class FilterConsumerBridgeToSqlRequest {
    r;
    nameProvider;
    where = '';
    _addWhere = true;
    promises = [];
    async resolveWhere() {
        while (this.promises.length > 0) {
            let p = this.promises;
            this.promises = [];
            for (const pr of p) {
                await pr;
            }
        }
        return this.where;
    }
    constructor(r, nameProvider) {
        this.r = r;
        this.nameProvider = nameProvider;
    }
    custom(key, customItem) {
        throw new Error('Custom filter should be translated before it gets here');
    }
    or(orElements) {
        let statement = '';
        this.promises.push((async () => {
            for (const element of orElements) {
                let f = new FilterConsumerBridgeToSqlRequest(this.r, this.nameProvider);
                f._addWhere = false;
                element.__applyToConsumer(f);
                let where = await f.resolveWhere();
                if (!where)
                    return; //since if any member of or is empty, then the entire or is irrelevant
                if (where.length > 0) {
                    if (statement.length > 0) {
                        statement += ' or ';
                    }
                    if (orElements.length > 1) {
                        statement += '(' + where + ')';
                    }
                    else
                        statement += where;
                }
            }
            this.addToWhere('(' + statement + ')');
        })());
    }
    not(element) {
        this.promises.push((async () => {
            let f = new FilterConsumerBridgeToSqlRequest(this.r, this.nameProvider);
            f._addWhere = false;
            element.__applyToConsumer(f);
            let where = await f.resolveWhere();
            if (!where)
                return; //since if any member of or is empty, then the entire or is irrelevant
            this.addToWhere('not (' + where + ')');
        })());
    }
    isNull(col) {
        this.promises.push((async () => this.addToWhere(this.nameProvider.$dbNameOf(col) + ' is null'))());
    }
    isNotNull(col) {
        this.promises.push((async () => this.addToWhere(this.nameProvider.$dbNameOf(col) + ' is not null'))());
    }
    isIn(col, val) {
        this.promises.push((async () => {
            if (val && val.length > 0)
                this.addToWhere(this.nameProvider.$dbNameOf(col) +
                    ' in (' +
                    val
                        .map((x) => this.r.param(col.valueConverter.toDb(x)))
                        .join(',') +
                    ')');
            else
                this.addToWhere('1 = 0 /*isIn with no values*/');
        })());
    }
    isEqualTo(col, val) {
        this.add(col, val, '=');
    }
    isDifferentFrom(col, val) {
        this.add(col, val, '<>');
    }
    isGreaterOrEqualTo(col, val) {
        this.add(col, val, '>=');
    }
    isGreaterThan(col, val) {
        this.add(col, val, '>');
    }
    isLessOrEqualTo(col, val) {
        this.add(col, val, '<=');
    }
    isLessThan(col, val) {
        this.add(col, val, '<');
    }
    containsCaseInsensitive(col, val) {
        this.promises.push((async () => {
            this.addToWhere('lower (' +
                this.nameProvider.$dbNameOf(col) +
                ") like lower ('%" +
                val.replace(/'/g, "''") +
                "%')");
        })());
    }
    notContainsCaseInsensitive(col, val) {
        this.promises.push((async () => {
            this.addToWhere('not lower (' +
                this.nameProvider.$dbNameOf(col) +
                ") like lower ('%" +
                val.replace(/'/g, "''") +
                "%')");
        })());
    }
    startsWithCaseInsensitive(col, val) {
        this.promises.push((async () => {
            this.addToWhere('lower (' +
                this.nameProvider.$dbNameOf(col) +
                ") like lower ('" +
                val.replace(/'/g, "''") +
                "%')");
        })());
    }
    endsWithCaseInsensitive(col, val) {
        this.promises.push((async () => {
            this.addToWhere('lower (' +
                this.nameProvider.$dbNameOf(col) +
                ") like lower ('%" +
                val.replace(/'/g, "''") +
                "')");
        })());
    }
    add(col, val, operator) {
        this.promises.push((async () => {
            let x = this.nameProvider.$dbNameOf(col) +
                ' ' +
                operator +
                ' ' +
                this.r.param(col.valueConverter.toDb(val));
            this.addToWhere(x);
        })());
    }
    addToWhere(x) {
        if (this.where.length == 0) {
            if (this._addWhere)
                this.where += ' where ';
        }
        else
            this.where += ' and ';
        this.where += x;
    }
    databaseCustom(databaseCustom) {
        this.promises.push((async () => {
            if (databaseCustom?.buildSql) {
                let item = new CustomSqlFilterBuilder(this.r, this.nameProvider.wrapIdentifier);
                let sql = await databaseCustom.buildSql(item);
                if (typeof sql !== 'string')
                    sql = item.sql;
                if (sql) {
                    this.addToWhere('(' + sql + ')');
                }
            }
        })());
    }
}
/**
 * Represents a custom SQL filter builder.
 */
export class CustomSqlFilterBuilder {
    r;
    wrapIdentifier;
    constructor(r, wrapIdentifier) {
        this.r = r;
        this.wrapIdentifier = wrapIdentifier;
        this.param.bind(this);
        this.filterToRaw.bind(this);
    }
    sql = '';
    /** @deprecated  use `param` instead*/
    addParameterAndReturnSqlToken(val) {
        return this.param(val);
    }
    /**
     * Adds a parameter value.
     * @param {valueType} val - The value to add as a parameter.
     * @param {FieldMetadata<valueType>} [field] - The field metadata.
     * @returns {string} - The SQL token.
     */
    param = (val, field) => {
        if (typeof field === 'object' && field.valueConverter.toDb) {
            val = field.valueConverter.toDb(val);
        }
        return this.r.param(val);
    };
    /**
     * Converts an entity filter into a raw SQL condition - and appends to it any `backendPrefilter` and `backendPreprocessFilter`
     * @param {RepositoryOverloads<entityType>} repo - The repository.
     * @param {EntityFilter<entityType>} condition - The entity filter.
     * @returns {Promise<string>} - The raw SQL.
     */
    filterToRaw = async (repo, condition) => {
        return SqlDatabase.filterToRaw(repo, condition, this, undefined, this.wrapIdentifier);
    };
}
export function isDbReadonly(field, dbNames) {
    return (field.dbReadOnly ||
        field.isServerExpression ||
        (field.options.sqlExpression && field.dbName != dbNames.$dbNameOf(field)));
}
export function shouldNotCreateField(field, dbNames) {
    return Boolean(field.isServerExpression ||
        (field.options.sqlExpression && field.dbName != dbNames.$dbNameOf(field)));
}
export function shouldCreateEntity(entity, e) {
    return (!entity.options.sqlExpression &&
        e.$entityName.toLowerCase().indexOf('from ') < 0);
}
export async function dbNamesOf(repo, wrapIdentifierOrOptions) {
    return internalDbNamesOf(repo, wrapIdentifierOrOptions);
}
export async function dbNamesOfWithForceSqlExpression(repo, wrapIdentifierOrOptions) {
    return internalDbNamesOf(repo, wrapIdentifierOrOptions, true);
}
async function internalDbNamesOf(repo, wrapIdentifierOrOptions, forceSqlExpression = false) {
    let options = typeof wrapIdentifierOrOptions === 'function'
        ? { wrapIdentifier: wrapIdentifierOrOptions }
        : wrapIdentifierOrOptions || {};
    var meta = getEntityMetadata(repo);
    if (!options.wrapIdentifier) {
        options.wrapIdentifier = remult.dataProvider.wrapIdentifier;
    }
    if (!options.wrapIdentifier)
        options.wrapIdentifier = (x) => x;
    const result = {
        $entityName: await entityDbName(meta, options.wrapIdentifier),
        toString: () => result.$entityName,
        $dbNameOf: (field) => {
            var key;
            if (typeof field === 'string')
                key = field;
            else
                key = field.key;
            return result[key];
        },
        wrapIdentifier: options.wrapIdentifier,
    };
    for (const field of meta.fields) {
        let r = await fieldDbName(field, meta, options.wrapIdentifier, forceSqlExpression);
        if (!field.options.sqlExpression)
            if (typeof options.tableName === 'string')
                r = options.wrapIdentifier(options.tableName) + '.' + r;
            else if (options.tableName === true) {
                r = result.$entityName + '.' + r;
            }
        ;
        result[field.key] = r;
    }
    return result;
}
export async function entityDbName(metadata, wrapIdentifier = (x) => x) {
    if (metadata.options.sqlExpression) {
        if (typeof metadata.options.sqlExpression === 'string')
            return metadata.options.sqlExpression;
        else if (typeof metadata.options.sqlExpression === 'function') {
            const prev = metadata.options.sqlExpression;
            try {
                metadata.options.sqlExpression =
                    "recursive sqlExpression call for entity '" + metadata.key + "'. ";
                return await prev(metadata);
            }
            finally {
                metadata.options.sqlExpression = prev;
            }
        }
    }
    return wrapIdentifier(metadata.dbName);
}
const sqlExpressionInProgressKey = Symbol.for(`sqlExpressionInProgressKey`);
export async function fieldDbName(f, meta, wrapIdentifier = (x) => x, forceSqlExpression = false) {
    try {
        if (f.options.sqlExpression) {
            let result;
            if (typeof f.options.sqlExpression === 'function') {
                if (f[sqlExpressionInProgressKey] && !forceSqlExpression) {
                    return "recursive sqlExpression call for field '" + f.key + "'. \0";
                }
                try {
                    ;
                    f[sqlExpressionInProgressKey] = true;
                    result = await f.options.sqlExpression(meta);
                    if (!result.includes('\0'))
                        f.options.sqlExpression = () => result;
                }
                finally {
                    delete f[sqlExpressionInProgressKey];
                }
            }
            else
                result = f.options.sqlExpression;
            if (!result)
                return f.dbName;
            return result;
        }
        const rel = getRelationFieldInfo(f);
        let field = rel?.type === 'toOne' &&
            f.options.field;
        if (field) {
            let fInfo = meta.fields.find(field);
            if (fInfo)
                return fieldDbName(fInfo, meta, wrapIdentifier, forceSqlExpression);
        }
        return wrapIdentifier(f.dbName);
    }
    finally {
    }
}
