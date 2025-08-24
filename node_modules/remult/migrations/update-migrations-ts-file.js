"use strict";
// consider replacing with https://www.npmjs.com/package/ts-morph
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMigrationsFile = updateMigrationsFile;
var tslib_1 = require("tslib");
function updateMigrationsFile(filePath, steps) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        function buildSteps() {
            return steps.map(function (step) {
                return ts.factory.createPropertyAssignment(ts.factory.createIdentifier((++maxStep).toString()), ts.factory.createIdentifier(step));
            });
        }
        var ts, fs, maxStep, importPath, importName, sourceFile, migrationsExportFound, updatedSourceFile, importFound_1, newMigrationsExport, code, prettier, err_1, options, err_2;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return tslib_1.__importStar(require('typescript')); })];
                case 1:
                    ts = _a.sent();
                    //@ts-ignore
                    if (ts.default)
                        ts = ts.default;
                    return [4 /*yield*/, Promise.resolve().then(function () { return tslib_1.__importStar(require('fs')); })];
                case 2:
                    fs = _a.sent();
                    maxStep = -1;
                    if (!fs.existsSync(filePath)) {
                        fs.writeFileSync(filePath, '');
                    }
                    importPath = 'remult/migrations';
                    importName = 'Migrations';
                    sourceFile = ts.createSourceFile(filePath, fs.readFileSync(filePath).toString(), ts.ScriptTarget.Latest, true);
                    migrationsExportFound = false;
                    updatedSourceFile = ts.transform(sourceFile, [
                        function (context) {
                            return function (node) {
                                var visitor = function (node) {
                                    if (ts.isVariableStatement(node) &&
                                        node.declarationList.declarations.length > 0) {
                                        var declaration = node.declarationList.declarations[0];
                                        if (ts.isIdentifier(declaration.name) &&
                                            declaration.name.text === 'migrations' &&
                                            declaration.initializer &&
                                            ts.isObjectLiteralExpression(declaration.initializer)) {
                                            migrationsExportFound = true;
                                            declaration.initializer.properties.forEach(function (property) {
                                                if (ts.isPropertyAssignment(property)) {
                                                    if (ts.isNumericLiteral(property.name)) {
                                                        var step = parseInt(property.name.text);
                                                        if (step > maxStep) {
                                                            maxStep = step;
                                                        }
                                                    }
                                                }
                                            });
                                            var steps_1 = buildSteps();
                                            // Found the "migrations" array
                                            // Update the initializer with the new steps
                                            var updatedInitializer = ts.factory.updateObjectLiteralExpression(declaration.initializer, tslib_1.__spreadArray(tslib_1.__spreadArray([], tslib_1.__read(declaration.initializer.properties), false), tslib_1.__read(steps_1), false));
                                            // Update the declaration with the new initializer
                                            var updatedDeclaration = ts.factory.updateVariableDeclaration(declaration, declaration.name, undefined, declaration.type, // Preserve the original type annotation if present
                                            updatedInitializer);
                                            return ts.factory.updateVariableStatement(node, node.modifiers, ts.factory.updateVariableDeclarationList(node.declarationList, [
                                                updatedDeclaration,
                                            ]));
                                        }
                                    }
                                    return ts.visitEachChild(node, visitor, context);
                                };
                                return ts.visitNode(node, visitor);
                            };
                        },
                    ]).transformed[0];
                    if (!migrationsExportFound) {
                        importFound_1 = false;
                        // Check if the import statement already exists
                        sourceFile.statements.forEach(function (statement) {
                            var _a, _b;
                            if (ts.isImportDeclaration(statement) &&
                                ts.isStringLiteral(statement.moduleSpecifier) &&
                                statement.moduleSpecifier.text === "".concat(importPath)) {
                                (_b = (_a = statement.importClause) === null || _a === void 0 ? void 0 : _a.namedBindings) === null || _b === void 0 ? void 0 : _b.forEachChild(function (namedBinding) {
                                    if (ts.isImportSpecifier(namedBinding) &&
                                        namedBinding.name.text === importName) {
                                        importFound_1 = true;
                                    }
                                });
                            }
                        });
                        // If the import statement doesn't exist, create it
                        if (!importFound_1) {
                            updatedSourceFile = ts.factory.updateSourceFile(updatedSourceFile, tslib_1.__spreadArray([
                                ts.factory.createExpressionStatement(ts.factory.createIdentifier("import type { ".concat(importName, " } from '").concat(importPath, "'")))
                            ], tslib_1.__read(updatedSourceFile.statements), false));
                        }
                        newMigrationsExport = ts.factory.createVariableStatement([ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)], ts.factory.createVariableDeclarationList([
                            ts.factory.createVariableDeclaration('migrations', undefined, // You can add a type annotation here if needed
                            ts.factory.createTypeReferenceNode(importName, undefined), ts.factory.createObjectLiteralExpression(buildSteps(), false)),
                        ], ts.NodeFlags.Const));
                        // Add the new export to the end of the file
                        updatedSourceFile = ts.factory.updateSourceFile(updatedSourceFile, tslib_1.__spreadArray(tslib_1.__spreadArray([], tslib_1.__read(updatedSourceFile.statements), false), [
                            newMigrationsExport,
                        ], false));
                    }
                    code = ts.createPrinter().printFile(updatedSourceFile);
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 11, , 12]);
                    prettier = void 0;
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, Promise.resolve("".concat('prettier' + '')).then(function (s) { return tslib_1.__importStar(require(s)); })];
                case 5:
                    prettier = _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    err_1 = _a.sent();
                    console.warn('error importing prettier,for better formatting run `npm i -D prettier`. Writing raw code to file.');
                    return [3 /*break*/, 7];
                case 7:
                    if (!prettier) return [3 /*break*/, 10];
                    return [4 /*yield*/, prettier.resolveConfig()];
                case 8:
                    options = _a.sent();
                    return [4 /*yield*/, prettier.format(code, tslib_1.__assign(tslib_1.__assign({}, options), { parser: 'typescript' }))];
                case 9:
                    code = _a.sent();
                    _a.label = 10;
                case 10: return [3 /*break*/, 12];
                case 11:
                    err_2 = _a.sent();
                    console.log('error formatting code, writing raw code to file.');
                    return [3 /*break*/, 12];
                case 12:
                    fs.writeFileSync(filePath, code);
                    return [2 /*return*/];
            }
        });
    });
}
