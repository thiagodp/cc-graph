#! /usr/bin/env node

import { main } from './main';
import { resolve } from 'path';

// const isBrowser = () => 'object' === typeof window;
const debugMode = true;
const showError = ( err: Error ) => {
    console.error( err.message, debugMode ? "\n" + err.stack : '' );
};
const showMessage = ( err: string, stack?: string ) => {
    console.error( err, stack && debugMode ? "\n" + stack : '' );
};

const warn = ( ...args: string[] ): void => {
    console.log( ` >`, ...args );
};

async function cli() {
    const argc = process.argv.length;
    // Validate arguments
    const preIndex: number = process.argv.findIndex( ( v ) => v.toLowerCase().endsWith( 'cli.js' ) );
    if ( preIndex < 0 || argc < 3 || preIndex >= argc - 1 ) {
        console.error( 'Syntax: cc-graph <features-dir> [output-dir]' );
        process.exit( 1 );
    }

    // Directories
    const processDir = process.cwd();
    const inputDir: string = resolve( processDir, process.argv[ preIndex + 1 ] );
    const outputDir: string = resolve( processDir,
        (( preIndex + 2 === process.argv.length - 1 ) ? process.argv[ preIndex + 2 ] : 'cc-graph-output') );
    // console.log( 'IN :', inputDir, "\nOUT:", outputDir );

    try {
        await main( inputDir, outputDir, warn );
    } catch (err) {
        if ( err.message.startsWith( 'ENOENT' ) ) {
            showMessage( 'Please inform a valid directory.', err.stack );
            process.exit( 1 );
        }
        showError( err );
        process.exit( 1 );
    }
}


cli().catch( showError );
