var timeseriesLayout = {
    autosize: false,
    width: 1024,
    height: 550,
    title: ' ',
    xaxis: {
        title: 'Decades',
        gridcolor: 'rgb(243, 243, 243)',
        type: 'linear',
        range: [1470, 1705],
        dtick: 10,
        zerolinewidth: 1,
        ticklen: 1,
	tickfont: {color: 'gray'},
        gridwidth: 1
    },
    yaxis: {
        title: 'term Change',
        gridcolor: 'rgb(243, 243, 243)',
        layer: 'below traces',
        range: [0, 1.05],
        dtick: 0.25,
        gridwidth: 1,
        showticklabels: true,
        tickmode: 'array',
        tickvals: [.25, .50, .75, 1.0],
        ticktext: ['25', '50', '75', '100%'],
        tickfont: {color: 'gray'}
    },
    paper_bgcolor: 'rgb(243, 243, 243)',
    plot_bgcolor: 'rgb(243, 243, 243)',
    showlegend: false,
    hovermode: 'closest',
    displayModeBar: false
};

var startingLayout = {
    autosize: false,
    width: 1024,
    height: 550,
    title: ' ',
    xaxis: {
        title: 'Decades',
        gridcolor: 'rgb(243, 243, 243)',
        type: 'linear',
        range: [1470, 1705],
        dtick: 10,
        zerolinewidth: 1,
        ticklen: 1,
	tickfont: {color: 'gray'},
        gridwidth: 1
    },
    yaxis: {
        title: 'term Change',
        gridcolor: 'rgb(243, 243, 243)',
        layer: 'below traces',
        range: [0, 1.05],
        dtick: 0.25,
        gridwidth: 1,
        showticklabels: true,
    	tickmode: 'array',
    	tickvals: [.25, .50, .75, 1.0],
    	ticktext: ['25', '50', '75', '100%'],
    	tickfont: {color: 'gray'}
    },
    annotations: [
        {
            x: 1700,
            y: 1,
            xref: 'Decades',
            yref: 'term Change',
            text: 'each decade is <br> compared with 1700',
            showarrow: true,
            arrowhead: 6,
            ax: 0,
            ay: -40
        },
        {
            x: 1490,
            y: 0.4763,
            xref: 'Decades',
            yref: 'term Change',
            text: 'lowest point is most <br> different from 1700',
            showarrow: true,
            arrowhead: 6,
            ax: 0,
            ay: 40
        },
        {
            x: 1650,
            y: 0.4636,
            xref: 'Decades',
            yref: 'term Change',
            text: 'terms nearest to <br> term in 1700',
            showarrow: true,
            arrowhead: 6,
            ax: 20,
            ay: 40
        },
        {
            x: 1670,
            y: 0.572,
            xref: 'Decades',
            yref: 'term Change',
            text: '',
            showarrow: true,
            arrowhead: 6,
            ax: -50,
            ay: 56
        },
        {
            x: 1505,
            y: 0.67,
            xref: 'Decades',
            yref: 'term Change',
            text: 'abrupt increase indicates <br> term meaning change',
            showarrow: true,
            arrowhead: 2,
            ax: -30,
            ay: -75
        }
    ],
    //margin: { pad: 20 },
    paper_bgcolor: 'rgb(243, 243, 243)',
    plot_bgcolor: 'rgb(243, 243, 243)',
    showlegend: false,
    hovermode: 'closest',
    displayModeBar: false
};


function getNnInfo(data) {
    var res = "";
    for (i = 19; i > 9; i--) {
        var n = data.neighbors[i];
        var p = (parseFloat(data.scores[i])*100).toFixed(2);
        res = res.concat(n, " - ", p, "%<br>");
    }
    return(res);
}


function replaceZero(arr) {
    for (i = 0; i < arr.length; i++) {
        if (arr[i] == "0") {
            arr[i] = null;
        }
    }

    return arr;
}


/* given a term's nerest neighbors in 1700 get traces over time for all */
function getNnTraces(neighborsTimeseries, decades) {
    var traces = [];
    for (const neighbor of neighborsTimeseries) {
        var y = replaceZero(neighbor.timeseries);
        var trace = {
            x: decades,
            y: y,
            mode: 'lines',
            type: 'scatter',
            line: {
                opacity: 0.7,
                color: 'rgb(128, 128, 128)',
                width: 0.5,
                shape: 'spline'
            },
            hovertext: neighbor.term,
            hoverinfo: 'text',
            // hovertemplate: '%{text}',
            hoverlabel: {namelength :-1}
        }
        traces.push(trace);
    }

    return traces;
}


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
