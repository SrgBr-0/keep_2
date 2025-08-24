import * as fs from 'fs';
import * as path from 'path';
import { JsonDataProvider } from '../index.js';
export class JsonEntityFileStorage {
    folderPath;
    getItem(entityDbName) {
        let fn = path.join(this.folderPath, entityDbName) + '.json';
        if (fs.existsSync(fn)) {
            return fs.readFileSync(fn).toString();
        }
        return null;
    }
    setItem(entityDbName, json) {
        if (!fs.existsSync(this.folderPath)) {
            fs.mkdirSync(this.folderPath);
        }
        return fs.writeFileSync(path.join(this.folderPath, entityDbName) + '.json', json);
    }
    constructor(folderPath) {
        this.folderPath = folderPath;
    }
}
export class JsonFileDataProvider extends JsonDataProvider {
    constructor(folderPath) {
        super(new JsonEntityFileStorage(folderPath), true);
    }
}
