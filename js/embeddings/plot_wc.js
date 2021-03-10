/* given a term generate term embeddings plots */
function plotWordChange(timeseries) {
    /*
    timeseries:  {
        "1470": {
	    similarity: 0.08,
	    terms: ["hello", "hi" ...],
	    scores: [0.98, 0.94, 0.75 ..],
	},
	"1480": {
	    ...
	},
	...
    }
    */
    var decades = []
    var sims = []
    var nninfo = []
    for (const [key, value] of Object.entries(timeseries) ) {
	var res = "";
	decades.push(parseInt(key));
	sims.push(1 - value.similarity);

	for (var j = 0; j < value.terms.length; j++) {
	    var n = value.terms[j];
	    var p = (value.scores[j] * 100).toFixed(2);
	    res = res.concat(n, " - ", p, "%<br>");
	}
	nninfo.push(res);
    }

    //var nntraces = getNnTraces(neighborsTimeseries, decades);
    //termTimeseries.timeseries = replaceZero(termTimeseries.timeseries);

    var colors = [];
    for (var i = 0; i < decades.length; i++)
        colors.push('rgb(243, 243, 243)');

    var trace1 = {
        x: decades,
        y: sims,
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
    //var data1 = [ trace1 ].concat(nntraces);
    var data = [trace1];

    var nnPlot = document.getElementById("nn-plot");
    Plotly.react(nnPlot, data,  timeseriesLayout);

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
