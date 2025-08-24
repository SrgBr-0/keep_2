"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = Entity;
var tslib_1 = require("tslib");
var context_js_1 = require("../context.js");
var getEntityRef_js_1 = require("./getEntityRef.js");
var remult_static_js_1 = require("../remult-static.js");
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
function Entity(key) {
    var options = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        options[_i - 1] = arguments[_i];
    }
    return function (target, info) {
        var theClass = target;
        while (theClass != null) {
            for (var rawFilterMember in theClass) {
                if (Object.prototype.hasOwnProperty.call(theClass, rawFilterMember)) {
                    var element = target[rawFilterMember];
                    if (element === null || element === void 0 ? void 0 : element.rawFilterInfo) {
                        if (!element.rawFilterInfo.key)
                            element.rawFilterInfo.key = rawFilterMember;
                    }
                }
            }
            theClass = Object.getPrototypeOf(theClass);
        }
        var factory = function (remult) {
            var e_1, _a;
            var r = {};
            try {
                for (var options_1 = tslib_1.__values(options), options_1_1 = options_1.next(); !options_1_1.done; options_1_1 = options_1.next()) {
                    var o = options_1_1.value;
                    if (o) {
                        if (typeof o === 'function')
                            o(r, remult);
                        else
                            Object.assign(r, o);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (options_1_1 && !options_1_1.done && (_a = options_1.return)) _a.call(options_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            var base = Object.getPrototypeOf(target);
            if (base) {
                var baseFactory = (0, getEntityRef_js_1.getEntitySettings)(base, false);
                if (baseFactory) {
                    var opt = baseFactory(remult);
                    if (opt) {
                        r = tslib_1.__assign(tslib_1.__assign({}, opt), r);
                    }
                }
            }
            return r;
        };
        remult_static_js_1.remultStatic.allEntities.push(target);
        (0, context_js_1.setControllerSettings)(target, { key: key });
        target[getEntityRef_js_1.entityInfo] = factory;
        target[getEntityRef_js_1.entityInfo_key] = key;
        return target;
    };
}
