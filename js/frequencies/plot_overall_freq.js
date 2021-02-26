/*
Creates two plots for the frequencies page:

1. Number of documents over time
2. Number of tokens over time

Need word counts per year and doc counts per year

*/


var layout = {
    title: ' ',
    autosize: false,
    xaxis: {
        title: 'Year',
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


function plotOverallFrequencies(word_counts, doc_counts) {
    /**
     * Create wordcounts over time AND docs over time plots
     * @param  {object} word_count keys are years values are counts
     * @param  {object} doc_count kyes are years values are counts
     */

    var traceterms = {
        x: Object.keys(word_counts),
        y: Object.values(word_counts),
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
        x: Object.keys(doc_counts),
        y: Object.values(doc_counts),
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
