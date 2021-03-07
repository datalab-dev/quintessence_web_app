/* given a term generate term embeddings plots */
function plotWordChange(term, decades, termTimeseries, decNeighbors,
    neighborsTimeseries, layout) {

    var nninfo = [];

    for (const decade of decades)
        nninfo.push(getNnInfo(decNeighbors[decade]));

    var nntraces = getNnTraces(neighborsTimeseries, decades);
    termTimeseries.timeseries = replaceZero(termTimeseries.timeseries);

    var colors = [];
    for (var i = 0; i < decades.length; i++)
        colors.push('rgb(243, 243, 243)');

    var trace1 = {
        x: decades,
        y: termTimeseries.timeseries,
        mode: 'lines+markers',
        type: 'scatter',
        color: 'steelblue',
        line: { opacity: 1, shape: 'spline', color: 'steelblue' },
        marker: {
            color: colors,
            symbol: 'circle',
            sizemode: 'diameter',
            size: 8,
            opacity: 1,
            line: {
                width: 1,
                opacity: 1,
                color: 'steelblue'
            }
        },
        text: nninfo,
        hovertemplate:
            '<br>Similarity Score: %{y:.2%}<br>Most similar terms:<br>%{text}',
        hoverlabel: {namelength : 0}
    };
    var data1 = [ trace1 ].concat(nntraces);

    var nnPlot = document.getElementById('nn-plot');
    Plotly.newPlot('nn-plot', data1, layout, {displayModeBar: false},
        {showSendToCloud: true});

    /* plot nearest neighbors histogram on click
    nnPlot.on('plotly_click', function(data) {
        var decade = data.points[0].x;
        plotHist('decade', decade, decNeighbors[decade], term);
    }); */

    /* change the color of a point hovered on */
    nnPlot.on('plotly_hover', function(data) {
    	newColors = [...colors];
        pn = data.points[data.points.length - 1].pointNumber;
        tn = data.points[data.points.length - 1].curveNumber;
        newColors[pn] = 'steelblue';

        var update = {'marker': {
            color: newColors,
            size: 8,
            line: {color: 'steelblue', width: 1}
        }};
        Plotly.restyle('nn-plot', update, [tn]);
    });
}
