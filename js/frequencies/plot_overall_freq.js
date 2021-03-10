/*
Creates two plots for the frequencies page:

1. Number of documents over time
2. Number of tokens over time

Need word counts per year and doc counts per year

*/
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

    Plotly.newPlot('termFreqPlot', [traceterms], overall_freq_layout,
        {displayModeBar: false}, {responsive: true});
    Plotly.newPlot('docFreqPlot', [traceDocs], overall_freq_layout, {displayModeBar: false},
        {responsive: true});
}
