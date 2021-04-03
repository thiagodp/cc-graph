#! /usr/bin/env node

import { main } from './main';
import { resolve } from 'path';

// const isBrowser = () => 'object' === typeof window;
let debugMode = false;

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
    const syntax = 'Syntax: cc-graph <features-dir> [output-dir] [--keep]';
    const argc = process.argv.length;
    // Validate arguments
    const preIndex: number = process.argv.findIndex( v => v.toLowerCase().endsWith( 'cli.js' ) );
    if ( preIndex < 0 || argc < 3 || preIndex >= argc - 1 ) {
        console.error( syntax );
        process.exit( 1 );
    }
    let args = process.argv.slice( preIndex + 1 );

    // Check argument --debug
    const debugModeIndex: number = args.findIndex( v => '--debug' == v );
    if ( debugModeIndex >= 0 ) {
        debugMode = true;
        args = args.filter( ( _, i ) => i !== debugModeIndex ); // Remove --debug
    }
    // Check argument --keep
    let keep: boolean = false;
    const keepIndex: number = args.findIndex( v => '--keep' == v );
    if ( keepIndex >= 0 ) {
        keep = true;
        args = args.filter( ( _, i ) => i !== keepIndex ); // Remove --keep
    }

    if ( args.length < 1 ) {
        console.error( syntax );
        process.exit( 1 );
    }

    // Directories
    const processDir = process.cwd();
    const inputDir: string = resolve( processDir, args[ 0 ] );
    const outputDir: string = resolve( processDir,
        ( args.length > 1 ? args[ 1 ] : 'cc-graph-output') );
    // console.log( 'IN :', inputDir, "\nOUT:", outputDir );

    try {
        await main( inputDir, outputDir, { warningFn: warn, keepFiles: keep } );
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
