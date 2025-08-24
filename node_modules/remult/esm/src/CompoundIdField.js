export class CompoundIdField {
    fields;
    constructor(...columns) {
        this.fields = columns;
    }
    apiUpdateAllowed(item) {
        throw new Error('Method not implemented.');
    }
    displayValue(item) {
        throw new Error('Method not implemented.');
    }
    includedInApi(item) {
        throw new Error('Method not implemented.');
    }
    toInput(value, inputType) {
        throw new Error('Method not implemented.');
    }
    fromInput(inputValue, inputType) {
        throw new Error('Method not implemented.');
    }
    getDbName() {
        return Promise.resolve('');
    }
    getId(instance) {
        let get = (field) => {
            return instance[field.key];
        };
        if (typeof instance === 'function') {
            get = instance;
        }
        let r = '';
        this.fields.forEach((c) => {
            if (r.length > 0)
                r += ',';
            r += c.valueConverter.toJson(get(c));
        });
        return r;
    }
    options = {};
    get valueConverter() {
        throw new Error('cant get value converter of compound id');
    }
    target;
    readonly = true;
    allowNull = false;
    dbReadOnly = false;
    isServerExpression = false;
    key = '';
    caption = '';
    inputType = '';
    dbName = '';
    valueType;
    isEqualTo(value) {
        let result = {};
        let val = value.toString();
        let id = val.split(',');
        this.fields.forEach((c, i) => {
            result[c.key] = c.valueConverter.fromJson(id[i]);
        });
        return result;
    }
}
