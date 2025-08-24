import { setControllerSettings } from '../context.js';
import { entityInfo, entityInfo_key, getEntitySettings, } from './getEntityRef.js';
import { remultStatic } from '../remult-static.js';
/**Decorates classes that should be used as entities.
 * Receives a key and an array of EntityOptions.
 * @example
 * import  { Entity, Fields } from "remult";
 * @Entity("tasks", {
 *    allowApiCrud: true
 * })
 * export class Task {
 *    @Fields.uuid()
 *    id!: string;
 *    @Fields.string()
 *    title = '';
 *    @Fields.boolean()
 *    completed = false;
 * }
 * @note
 * EntityOptions can be set in two ways:
 * @example
 * // as an object
 * @Entity("tasks",{ allowApiCrud:true })
 * @example
 * // as an arrow function that receives `remult` as a parameter
 * @Entity("tasks", (options,remult) => options.allowApiCrud = true)
 */
export function Entity(key, ...options) {
    return (target, info) => {
        let theClass = target;
        while (theClass != null) {
            for (const rawFilterMember in theClass) {
                if (Object.prototype.hasOwnProperty.call(theClass, rawFilterMember)) {
                    const element = target[rawFilterMember];
                    if (element?.rawFilterInfo) {
                        if (!element.rawFilterInfo.key)
                            element.rawFilterInfo.key = rawFilterMember;
                    }
                }
            }
            theClass = Object.getPrototypeOf(theClass);
        }
        let factory = (remult) => {
            let r = {};
            for (const o of options) {
                if (o) {
                    if (typeof o === 'function')
                        o(r, remult);
                    else
                        Object.assign(r, o);
                }
            }
            let base = Object.getPrototypeOf(target);
            if (base) {
                let baseFactory = getEntitySettings(base, false);
                if (baseFactory) {
                    let opt = baseFactory(remult);
                    if (opt) {
                        r = {
                            ...opt,
                            ...r,
                        };
                    }
                }
            }
            return r;
        };
        remultStatic.allEntities.push(target);
        setControllerSettings(target, { key });
        target[entityInfo] = factory;
        target[entityInfo_key] = key;
        return target;
    };
}
