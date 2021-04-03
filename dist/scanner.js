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
exports.scanFeatureFiles = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const util_1 = require("util");
/**
 * Recursively retrieves feature files from the given directory
 * and put them into the given array.
 *
 * @param dir Directory
 * @param target Target array
 */
function scanFeatureFiles(dir, target) {
    return __awaiter(this, void 0, void 0, function* () {
        const _readdir = util_1.promisify(fs_1.readdir);
        const _stat = util_1.promisify(fs_1.stat);
        const featureRegex = /\.feature$/i;
        const paths = yield _readdir(dir, { encoding: 'utf-8' });
        for (const entry of paths) {
            const path = path_1.resolve(dir, entry);
            const pStat = yield _stat(path);
            if (pStat.isDirectory()) {
                yield scanFeatureFiles(path, target);
                continue;
            }
            if (!featureRegex.test(path)) {
                continue;
            }
            target.push(path);
        }
    });
}
exports.scanFeatureFiles = scanFeatureFiles;
