"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.describeClass = describeClass;
exports.describeBackendMethods = describeBackendMethods;
exports.describeEntity = describeEntity;
var server_action_js_1 = require("../server-action.js");
var entity_js_1 = require("./entity.js");
function describeClass(classType, classDescriber, members, staticMembers) {
    if (classDescriber)
        classDescriber(classType);
    for (var fieldKey in members) {
        if (Object.prototype.hasOwnProperty.call(members, fieldKey)) {
            var element = members[fieldKey];
            var prop = Object.getOwnPropertyDescriptor(classType.prototype, fieldKey);
            element(classType.prototype, fieldKey, prop);
            if (prop)
                Object.defineProperty(classType.prototype, fieldKey, prop);
        }
    }
    for (var staticFieldKey in staticMembers) {
        var staticElement = staticMembers[staticFieldKey];
        var prop = Object.getOwnPropertyDescriptor(classType, staticFieldKey);
        staticElement(classType, staticFieldKey, prop);
        if (prop)
            Object.defineProperty(classType, staticFieldKey, prop);
    }
}
function describeBackendMethods(classType, backendMethods) {
    var result = {};
    for (var key in backendMethods) {
        if (Object.prototype.hasOwnProperty.call(backendMethods, key)) {
            var options = backendMethods[key];
            result[key] = (0, server_action_js_1.BackendMethod)(options);
        }
    }
    describeClass(classType, undefined, undefined, result);
}
function describeEntity(classType, key, fields, options) {
    describeClass(classType, (0, entity_js_1.Entity)(key, options), fields);
}
