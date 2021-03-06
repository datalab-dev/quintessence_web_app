/*
Creates plot for relative word frequency over time. 
Plot can be updated to add a new word (as a new trace) and also to remove words.

Needs words frequency and relative frequency over time
*/
function plotFrequencies(frequencies) {
    /**
     * Given collection of term frequencies plots each of those terms.
     * to update the plot simply add or remove the term from the collection
     * and call this function
     *
     * @param  {object} frequencies Object keys are terms, values are objects
     * the values object contains two nested objects: freq and relFreq
     * nest objects have form {year: count, year2: count...}
     * 
     */

    var traces = [];
    var myterms = Object.keys(frequencies);

    for (const term of myterms) {
	var years = Object.keys(frequencies[term]["relFreq"]);
	var freq = Object.values(frequencies[term]["freq"]);
	var relFreq = Object.values(frequencies[term]["relFreq"]);

	var avg = moving_average(relFreq, 5);

        var trace = {
            x: years,
            y: relFreq,
            name: term,
            mode: 'lines',
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
            line: { opacity: 1, shape: 'spline' },
            color: 'steelblue3',
            text: freq,
            hovertemplate: '%{y:.2%} of terms used in %{x} <br>Total Occurrences: %{text:,}',
            hoverlabel: {namelength : 0}
        };

        var trace2 = {
            x: years,
            y: avg,
            name: term + " moving average 5 years",
            mode: 'lines',
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
            line: { opacity: 1, shape: 'spline' },
            color: 'steelblue3',
            text: freq,
            hovertemplate: '%{y:.2%} of terms used in %{x} <br>Total Occurrences: %{text:,}',
            hoverlabel: {namelength : 0}
        };

        traces.push(trace);
        traces.push(trace2);
    }

    var nnPlot = document.getElementById('freqPlot');
    Plotly.newPlot('freqPlot', traces, freq_layout, {displayModeBar: false}, {responsive: true});
}


