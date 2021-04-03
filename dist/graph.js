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
exports.buildGraph = void 0;
const path_1 = require("path");
const parser_1 = require("./parser");
function buildGraph(files, warningFn) {
    return __awaiter(this, void 0, void 0, function* () {
        const graph = { nodes: [], edges: [] };
        const fileMap = new Map();
        const lowercasedFiles = [];
        // Map all the nodes, but not the edges
        for (const file of files) {
            const featureInfo = yield parser_1.parseFeatureFile(file);
            if (!featureInfo.feature) {
                continue;
            }
            const lcFile = file.toLowerCase();
            fileMap.set(lcFile, featureInfo);
            lowercasedFiles.push(lcFile);
            const node = {
                data: {
                    id: file,
                    feature: featureInfo.feature,
                    filename: path_1.basename(file)
                }
            };
            graph.nodes.push(node);
        }
        // Now map the edges
        for (const file of files) {
            const featureInfo = fileMap.get(file.toLowerCase());
            if (!featureInfo) {
                continue;
            }
            const dir = path_1.dirname(file);
            for (const imp of featureInfo.imports || []) {
                const impFile = path_1.resolve(dir, imp);
                if (!lowercasedFiles.includes(impFile.toLowerCase())) {
                    if (warningFn) {
                        warningFn(`${path_1.basename(file)}: imported file "${imp}" was not found.`);
                    }
                    continue;
                }
                const edge = {
                    data: {
                        id: file + '|' + impFile,
                        source: file,
                        target: impFile
                    }
                };
                graph.edges.push(edge);
            }
        }
        return graph;
    });
}
exports.buildGraph = buildGraph;
