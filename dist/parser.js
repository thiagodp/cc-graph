"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFeatureLines = exports.parseFeatureFile = void 0;
const fs_1 = require("fs");
const util_1 = require("util");
function parseFeatureFile(path) {
    return __awaiter(this, void 0, void 0, function* () {
        const _readFile = util_1.promisify(fs_1.readFile);
        const content = yield _readFile(path, { encoding: 'utf-8' });
        const lines = content.split('\n');
        return parseFeatureLines(lines);
    });
}
exports.parseFeatureFile = parseFeatureFile;
function parseFeatureLines(lines) {
    const importRegex = /^[ \t]*importe?[ \t]*\"(.*)\"[ \t]*/i;
    const featureRegex = /^[ \t]*(?:feature|funcionalidade)[ \t]*\:[ \t]*(.*)/i;
    const info = {};
    for (const line of lines) {
        // Ignore empty lines
        if ('' === line.trim()) {
            continue;
        }
        // Extract import
        const ri = importRegex.exec(line);
        if (ri) {
            if (undefined === info.imports) {
                info.imports = [];
            }
            info.imports.push(ri[1]);
        }
        // Extract feature
        const rf = featureRegex.exec(line);
        if (rf) {
            info.feature = rf[1];
            break;
        }
    }
    return info;
}
exports.parseFeatureLines = parseFeatureLines;
