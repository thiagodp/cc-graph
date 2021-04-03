import { R_OK, W_OK } from 'constants';
import { access, readFile, writeFile } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

export async function copyFile( from: string, to: string, overwrite: boolean = false ): Promise< void > {
    if ( ! overwrite ) {
        const _access = promisify( access );
        try {
            await _access( to, R_OK | W_OK );
            return; // Exit because the file exists
        } catch ( err ) {
            // File does not exist - continue
        }
    }
    const _readFile = promisify( readFile );
    const _writeFile = promisify( writeFile );
    const content = await _readFile( from );
    await _writeFile( to, content );
}

export async function copyGraphLibrary( directory: string ): Promise< void > {
    const file = 'cytoscape.min.js';
    const from = join( __dirname, '../node_modules/cytoscape/dist/', file );
    const to = join( directory, file );
    await copyFile( from, to );
}

// copyGraphLibrary( '../web' ).catch( console.log );