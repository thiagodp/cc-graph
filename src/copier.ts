import { R_OK, W_OK } from 'constants';
import { access, readFile, writeFile } from 'fs';
import { join } from 'path';
import { promisify } from 'util';
import resolvePkg from 'resolve-pkg';

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
    const pkgPath = resolvePkg( 'cytoscape', { cwd: __dirname } );
    const file = 'cytoscape.min.js';
    const from = join( pkgPath || '../../cytoscape', 'dist/', file );
    const to = join( directory, file );
    await copyFile( from, to );
}

// copyGraphLibrary( '../web' ).catch( console.log );