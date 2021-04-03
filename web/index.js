function buildGraph( data ) {

    var style = cytoscape
        .stylesheet()
        .selector('node')
        .style({
            content: 'data(feature)'
        })
        .selector('edge')
        .style({
            'curve-style': 'bezier',
            'target-arrow-shape': 'triangle',
            width: 4,
            'line-color': '#ddd',
            'target-arrow-color': '#ddd'
        })
        .selector('.highlighted')
        .style({
            'background-color': '#61bffc',
            'line-color': '#61bffc',
            'target-arrow-color': '#61bffc',
            'transition-property': 'background-color, line-color, target-arrow-color',
            'transition-duration': '0.5s'
        });

    var config = {
        container: document.getElementById('graph'),
        elements: data,
        style: style,

        boxSelectionEnabled: false,
        autounselectify: true,

        layout: {
            name: 'cose',
            directed: true,
            // roots: '#a',
            padding: 10
        }
    };

    return cytoscape( config );
    // var bfs = cy.elements().bfs('#a', function() {}, true);
    /*
    var bfs = cy.elements().bfs({}, function() {}, true);
    var i = 0;
    var highlightNext = function() {
        if (i < bfs.path.length) {
            bfs.path[i].addClass('highlighted');
            i++;
            setTimeout(highlightNext, 1000);
        }
    };


    highlightNext();
    */
}

var cy = null;

function reset( data ) {
    if ( cy ) {
        cy.destroy();
        cy = null;
    }
    cy = buildGraph( data );
}

function saveFile(url, fileName){
    var a = document.createElement("a");
    a.style = "display: none";
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    setTimeout( function() {
        window.URL.revokeObjectURL(url);
        a.remove();
    }, 500 );

}

function run() {

    reset( window.app.data );

    function reload() {
        // window.location.reload();
        reset( window.app.data );
    }

    document.getElementById( 'reload' ).addEventListener( 'click', reload );
    window.addEventListener( 'resize', reload );


    document.getElementById( 'saveAs' ).addEventListener( 'click', function saveAs() {
        if ( ! cy ) {
            return;
        }
        var jpgBase64 = cy.jpg();
        var image = document.getElementById( 'image' );
        image.setAttribute( 'src', jpgBase64 );

        saveFile( jpgBase64, 'features.jpg' );
    } );


    function invertEdgesDirection() {
        var edges = window.app.data.edges;
        // console.log( 'Before', edges );
        for ( var i in edges ) {
            var edge = edges[ i ].data;
            var tmp = edge.target;
            edge.target = edge.source;
            edge.source = tmp;
        }
        // console.log( 'After', edges );
        reset( window.app.data );
    }

    document.getElementById( 'show' ).addEventListener( 'change', function( ev ) {
        if ( 'dependencies' == ev.target.value ) {
            reload();
        } else {
            invertEdgesDirection();
        }
    } );
}


window.addEventListener( 'load', run );