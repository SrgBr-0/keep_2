export class JsonEntityOpfsStorage {
    //@internal
    opfsRoot;
    async getItem(entityDbName) {
        const opfsFile = await (await this.init()).getFileHandle(entityDbName + '.json', {
            create: true,
        });
        const readable = await opfsFile.getFile();
        return await readable.text();
    }
    //@internal
    async init() {
        if (!this.opfsRoot) {
            this.opfsRoot = await navigator.storage.getDirectory();
        }
        return this.opfsRoot;
    }
    async setItem(entityDbName, json) {
        const opfsFile = await await (await this.init()).getFileHandle(entityDbName + '.json', {
            create: true,
        });
        const writable = await opfsFile.createWritable();
        await writable.write(json);
        await writable.close();
    }
}
