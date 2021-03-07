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
