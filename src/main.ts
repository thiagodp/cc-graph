import { W_OK } from 'constants';
import { access, mkdir, writeFile } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

import { copyFile, copyGraphLibrary } from './copier';
import { buildGraph, GraphData, WarningFn } from './graph';
import { scanFeatureFiles } from './scanner';

export async function main(
    inputDir: string,
    outputDir: string,
    warningFn?: WarningFn
): Promise< void > {
    // Scan feature files
    const files: string[] = [];
    await scanFeatureFiles( inputDir, files );
    const graph: GraphData = await buildGraph( files, warningFn );
    // Check output directory
    const _access = promisify( access );
    try {
        await _access( outputDir, W_OK );
    } catch ( err ) {
        // Directory does not exist - create it
        const _mkdir = promisify( mkdir );
        await _mkdir( outputDir );
    }
    // Save graph to file
    await saveGraphToJsFile( graph, outputDir, 'data.js' );
    // Copy other files
    const fromDir = join( __dirname, '../web' );
    await copyFile( join( fromDir, 'index.html' ), join( outputDir, 'index.html' ) );
    await copyFile( join( fromDir, 'style.css' ), join( outputDir, 'style.css' ) );
    await copyFile( join( fromDir, 'index.js' ), join( outputDir, 'index.js' ) );
    await copyGraphLibrary( outputDir );
}


async function saveGraphToJsFile(
    graph: GraphData,
    outputDir: string,
    file: string
): Promise< void > {
    const _writeFile = promisify( writeFile );
    const js = `
window.app = window.app || {};
window.app.data = ` + JSON.stringify( graph, undefined, "\t" ) + ";\n";
    await _writeFile( join( outputDir, file ), js );
}
