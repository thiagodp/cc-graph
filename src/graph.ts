import { basename, dirname, resolve } from 'path';

import { FeatureInfo, parseFeatureFile } from './parser';

// Cytoscape format + extra. File path is used as id.
export type NodeData = { data: { id: string, feature: string, filename: string } };
export type EdgeData = { data: { id: string, source: string, target: string } };
export type GraphData = { nodes: NodeData[], edges: EdgeData[] };


export type WarningFn = ( ...args: string[] ) => void;


export async function buildGraph(
    files: string[],
    warningFn?: WarningFn
): Promise< GraphData > {
    const graph: GraphData = { nodes: [], edges: [] };
    const fileMap: Map< string, FeatureInfo > = new Map< string, FeatureInfo >();
    const lowercasedFiles: string[] = [];

    // Map all the nodes, but not the edges
    for ( const file of files ) {
        const featureInfo: FeatureInfo = await parseFeatureFile( file );
        if ( ! featureInfo.feature ) {
            continue;
        }
        const lcFile = file.toLowerCase();
        fileMap.set( lcFile, featureInfo );
        lowercasedFiles.push( lcFile );
        const node: NodeData = {
            data: {
                id: file,
                feature: featureInfo.feature,
                filename: basename( file )
            }
        };
        graph.nodes.push( node );
    }

    // Now map the edges
    for ( const file of files ) {
        const featureInfo: FeatureInfo | undefined = fileMap.get( file.toLowerCase() );
        if ( ! featureInfo ) {
            continue;
        }
        const dir = dirname( file );
        for ( const imp of featureInfo.imports || [] ) {
            const impFile = resolve( dir, imp );
            if ( ! lowercasedFiles.includes( impFile.toLowerCase() ) ) {
                if ( warningFn ) {
                    warningFn( `${basename(file)}: imported file "${imp}" was not found.` );
                }
                continue;
            }
            const edge: EdgeData = {
                data: {
                    id: file + '|' + impFile,
                    source: file,
                    target: impFile
                }
            };
            graph.edges.push( edge );
        }
    }
    return graph;
}
