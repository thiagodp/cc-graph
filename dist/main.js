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
exports.main = void 0;
const constants_1 = require("constants");
const fs_1 = require("fs");
const path_1 = require("path");
const util_1 = require("util");
const copier_1 = require("./copier");
const graph_1 = require("./graph");
const scanner_1 = require("./scanner");
function main(inputDir, outputDir, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        // Scan feature files
        const files = [];
        yield scanner_1.scanFeatureFiles(inputDir, files);
        const graph = yield graph_1.buildGraph(files, options.warningFn);
        // Check output directory
        const _access = util_1.promisify(fs_1.access);
        try {
            yield _access(outputDir, constants_1.W_OK);
        }
        catch (err) {
            // Directory does not exist - create it
            const _mkdir = util_1.promisify(fs_1.mkdir);
            yield _mkdir(outputDir, { recursive: true });
        }
        // Save graph to file
        yield saveGraphToJsFile(graph, outputDir, 'data.js');
        // Copy other files
        const fromDir = path_1.join(__dirname, '../web');
        yield copier_1.copyFile(path_1.join(fromDir, 'index.html'), path_1.join(outputDir, 'index.html'), !options.keepFiles);
        yield copier_1.copyFile(path_1.join(fromDir, 'style.css'), path_1.join(outputDir, 'style.css'), !options.keepFiles);
        yield copier_1.copyFile(path_1.join(fromDir, 'index.js'), path_1.join(outputDir, 'index.js'), !options.keepFiles);
        yield copier_1.copyGraphLibrary(outputDir);
    });
}
exports.main = main;
function saveGraphToJsFile(graph, outputDir, file) {
    return __awaiter(this, void 0, void 0, function* () {
        const _writeFile = util_1.promisify(fs_1.writeFile);
        const js = `
window.app = window.app || {};
window.app.data = ` + JSON.stringify(graph, undefined, "\t") + ";\n";
        yield _writeFile(path_1.join(outputDir, file), js);
    });
}
