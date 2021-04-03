#! /usr/bin/env node
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
const main_1 = require("./main");
const path_1 = require("path");
// const isBrowser = () => 'object' === typeof window;
const debugMode = true;
const showError = (err) => {
    console.error(err.message, debugMode ? "\n" + err.stack : '');
};
const showMessage = (err, stack) => {
    console.error(err, stack && debugMode ? "\n" + stack : '');
};
const warn = (...args) => {
    console.log(` >`, ...args);
};
function cli() {
    return __awaiter(this, void 0, void 0, function* () {
        const argc = process.argv.length;
        // Validate arguments
        const preIndex = process.argv.findIndex((v) => v.toLowerCase().endsWith('cli.js'));
        if (preIndex < 0 || argc < 3 || preIndex >= argc - 1) {
            console.error('Syntax: cc-graph <features-dir> [output-dir]');
            process.exit(1);
        }
        // Directories
        const processDir = process.cwd();
        const inputDir = path_1.resolve(processDir, process.argv[preIndex + 1]);
        const outputDir = path_1.resolve(processDir, ((preIndex + 2 === process.argv.length - 1) ? process.argv[preIndex + 2] : 'cc-graph-output'));
        // console.log( 'IN :', inputDir, "\nOUT:", outputDir );
        try {
            yield main_1.main(inputDir, outputDir, warn);
        }
        catch (err) {
            if (err.message.startsWith('ENOENT')) {
                showMessage('Please inform a valid directory.', err.stack);
                process.exit(1);
            }
            showError(err);
            process.exit(1);
        }
    });
}
cli().catch(showError);
