"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrate = exports.generateMigrations = void 0;
var generate_migrations_js_1 = require("./generate-migrations.js");
Object.defineProperty(exports, "generateMigrations", { enumerable: true, get: function () { return generate_migrations_js_1.generateMigrations; } });
var migrate_js_1 = require("./migrate.js");
Object.defineProperty(exports, "migrate", { enumerable: true, get: function () { return migrate_js_1.migrate; } });
