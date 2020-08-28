var histLayout = {
    autosize: false,
    width: 1024,
    height: 550,
    barmode: 'stack',
    title: null,
    xaxis: {
        title: '',
        type: 'log',
        showgrid: false,
        showline: false,
        showticklabels: false,
        zeroline: false,
	hoverformat: '.2%'
    },
    yaxis: {
        showticklabels: false,
        showgrid: false,
        zeroline: false
    },
    margin: { l: 150, r: 50, b: 20, t: 75 },
    legend: { orientation: 'h' },
    paper_bgcolor: 'rgb(243, 243, 243)',
    plot_bgcolor: 'rgb(243, 243, 243)',
    autosize: true,
    displayModeBar: false
};

function plotHist(category, sel, nn, term) {
    var trace = {
	x: nn.scores,
        y: nn.neighbors,
        type: 'bar',
        orientation: 'h',
        hovertemplate: '%{x} similarity',
	hoverlabel: {namelength : 0},
	marker: {
            color: 'steelblue3',
            opacity: 0.65,
            line: {
                color: 'black',
                opacity: 1,
                width: 1
            }
        }
    };

    var element;
    switch(category) {
        case 'decade':
            var title = `Most similar to "${term}" in ${sel}`;
            element = 'dec-hist';
            break;
        case 'author':
            var title = `Most similar to "${term}" in texts by ${sel}`;
            element = 'auth-hist';
            break;
        case 'location':
            var title = `Most similar to "${term}" in texts from ${sel}`;
            element = 'loc-hist';
            break;
        case 'full':
            var title = `Most similar to "${term}" in all texts`;
            element = 'full-hist';
            break;
    }

    var authHistLayout = histLayout;
    authHistLayout.title = title;
    authHistLayout.yaxis = {
        title: '',
        dtick: 1
    };
    Plotly.newPlot(element, [trace], authHistLayout, {displayModeBar: false},
        {showSendToCloud: true});
}
