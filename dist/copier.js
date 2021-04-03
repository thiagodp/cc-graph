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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyGraphLibrary = exports.copyFile = void 0;
const constants_1 = require("constants");
const fs_1 = require("fs");
const path_1 = require("path");
const util_1 = require("util");
const resolve_pkg_1 = __importDefault(require("resolve-pkg"));
function copyFile(from, to, overwrite = false) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!overwrite) {
            const _access = util_1.promisify(fs_1.access);
            try {
                yield _access(to, constants_1.R_OK | constants_1.W_OK);
                return; // Exit because the file exists
            }
            catch (err) {
                // File does not exist - continue
            }
        }
        const _readFile = util_1.promisify(fs_1.readFile);
        const _writeFile = util_1.promisify(fs_1.writeFile);
        const content = yield _readFile(from);
        yield _writeFile(to, content);
    });
}
exports.copyFile = copyFile;
function copyGraphLibrary(directory) {
    return __awaiter(this, void 0, void 0, function* () {
        const pkgPath = resolve_pkg_1.default('cytoscape', { cwd: __dirname });
        const file = 'cytoscape.min.js';
        const from = path_1.join(pkgPath || '../../cytoscape', 'dist/', file);
        const to = path_1.join(directory, file);
        yield copyFile(from, to);
    });
}
exports.copyGraphLibrary = copyGraphLibrary;
// copyGraphLibrary( '../web' ).catch( console.log );
