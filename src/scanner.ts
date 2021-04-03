import { stat, readdir } from 'fs';
import { resolve } from 'path';
import { promisify } from 'util';

/**
 * Recursively retrieves feature files from the given directory
 * and put them into the given array.
 *
 * @param dir Directory
 * @param target Target array
 */
export async function scanFeatureFiles( dir: string, target: string[] ): Promise< void > {

    const _readdir = promisify( readdir );
    const _stat = promisify( stat );
    const featureRegex = /\.feature$/i;

    const paths = await _readdir( dir, { encoding: 'utf-8' } );
    for ( const entry of paths ) {
        const path = resolve( dir, entry );
        const pStat = await _stat( path );
        if ( pStat.isDirectory() ) {
            await scanFeatureFiles( path, target );
            continue;
        }
        if ( ! featureRegex.test( path ) ) {
            continue;
        }
        target.push( path );
    }
}
