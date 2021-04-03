import { readFile } from "fs";
import { promisify } from "util";

export interface FeatureInfo {
    feature?: string;
    imports?: string[];
}

export async function parseFeatureFile( path: string ): Promise< FeatureInfo > {
    const _readFile = promisify( readFile );
    const content = await _readFile( path, { encoding: 'utf-8' } );
    const lines = content.split( '\n' );
    return parseFeatureLines( lines );
}

export function parseFeatureLines( lines: string[] ): FeatureInfo {

    const importRegex = /^[ \t]*importe?[ \t]*\"(.*)\"[ \t]*/i;
    const featureRegex = /^[ \t]*(?:feature|funcionalidade)[ \t]*\:[ \t]*(.*)/i;
    const info: FeatureInfo = {};

    for ( const line of lines ) {

        // Ignore empty lines
        if ( '' === line.trim() ) {
            continue;
        }

        // Extract import
        const ri = importRegex.exec( line );
        if ( ri ) {
            if ( undefined === info.imports ) {
                info.imports = [];
            }
            info.imports.push( ri[ 1 ] );
        }

        // Extract feature
        const rf = featureRegex.exec( line );
        if ( rf ) {
            info.feature = rf[ 1 ];
            break;
        }
    }

    return info;
}