var layout = {
    title: ' ',
    autosize: false,
    xaxis: {
        title: 'Decades',
        gridcolor: 'rgb(243, 243, 243)',
        type: 'linear',
        range: [1470, 1700],
        dtick: 10,
        zerolinewidth: 1,
        ticklen: 1,
        gridwidth: 1
    },
    yaxis: {
        title: 'Frequency',
        gridcolor: 'rgb(243, 243, 243)',
        // layer: 'below traces',
        gridwidth: 1,
        showticklabels: true,
        ticklen: 1,
        showline: true
    },
    paper_bgcolor: 'rgb(243, 243, 243)',
    plot_bgcolor: 'rgb(243, 243, 243)',
    showlegend: false,
    hovermode: 'closest',
    width: 1024,
    height: 600
};


function plotOverallFrequencies(data) {
    var decades = range(1480, 1700, 10);

    var traceterms = {
        x: decades,
        y: data.termFreqs,
        type: 'bar',
        marker: {
            symbol: 28,
            sizemode: 'diameter',
            size: 5,
            opacity: 1,
            line: {
                size: 1,
                color: 'black',
                opacity: 1
            }
        },
        line: { opacity: 1 },
        color: 'steelblue3',
        // text: 'test',
        hovertemplate: '%{y:.3s} total terms',
        hoverlabel: {namelength : 0}
    };

    var traceDocs = {
        x: decades,
        y: data.docFreqs,
        type: 'bar',
        marker: {
            symbol: 28,
            sizemode: 'diameter',
            size: 5,
            opacity: 1,
            line: {
                size: 1,
                color: 'steelblue3',
                opacity: 1
            }
        },
        line: { opacity: 1 },
        color: 'steelblue3',
        hovertemplate: '%{y:.3s} total documents',
        hoverlabel: {namelength : 0}
    };

    Plotly.newPlot('termFreqPlot', [traceterms], layout,
        {displayModeBar: false}, {responsive: true});
    Plotly.newPlot('docFreqPlot', [traceDocs], layout, {displayModeBar: false},
        {responsive: true});
}
