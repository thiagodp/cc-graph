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
let debugMode = false;
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
        const syntax = 'Syntax: cc-graph <features-dir> [output-dir]';
        const argc = process.argv.length;
        // Validate arguments
        const preIndex = process.argv.findIndex(v => v.toLowerCase().endsWith('cli.js'));
        if (preIndex < 0 || argc < 3 || preIndex >= argc - 1) {
            console.error(syntax);
            process.exit(1);
        }
        let args = process.argv.slice(preIndex + 1);
        // Check for debug mode
        const debugModeIndex = args.findIndex(v => '--debug' == v);
        if (debugModeIndex >= 0) {
            debugMode = true;
            args = args.filter((_, i) => i !== debugModeIndex); // Remove --debug
        }
        if (args.length < 1) {
            console.error(syntax);
            process.exit(1);
        }
        // Directories
        const processDir = process.cwd();
        const inputDir = path_1.resolve(processDir, args[0]);
        const outputDir = path_1.resolve(processDir, (args.length > 1 ? args[1] : 'cc-graph-output'));
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
