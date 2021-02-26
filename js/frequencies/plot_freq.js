/*
Creates plot for relative word frequency over time. 
Plot can be updated to add a new word (as a new trace) and also to remove words.

Needs words frequency and relative frequency over time
*/


var freq_layout = {
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
        title: 'Relative Frequency (%)',
        gridcolor: 'rgb(243, 243, 243)',
        gridwidth: 1,
        rangemode: 'tozero',
	exponentformat: "none",
        showticklabels: true,
        ticklen: 1,
        showline: true
    },
    rangemode: 'nonnegative',
    paper_bgcolor: 'rgb(243, 243, 243)',
    plot_bgcolor: 'rgb(243, 243, 243)',
    showlegend: true,
    hovermode: 'closest',
    width: 1024,
    height: 600
};


const range = (start, stop, step = 1) =>
Array(Math.ceil((stop - start) / step)).fill(start).map((x, y) => x + y * step);


Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};


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
        var trace = {
            x: Object.keys(frequencies[term]["relFreq"]),
            y: Object.values(frequencies[term]["relFreq"]),
            name: term,
            mode: 'lines+markers',
            type: 'scatter',
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
            text: Object.values(frequencies[term]["freq"]),
            hovertemplate: '%{y:.2%} of terms Used in %{x} <br>Total Occurrences: %{text:,}',
            hoverlabel: {namelength : 0}
        };
        traces.push(trace);
    }

    var nnPlot = document.getElementById('freqPlot');
    Plotly.newPlot('freqPlot', traces, freq_layout, {displayModeBar: false}, {responsive: true});
}


function addTermFreq(term, frequencies) {
    /**
     * Add term to the relative frequency plot
     *
     * @param  {string} term word to plot
     * @param  {object} frequencies object containing data for each term
     *
     */ 

    /* add button for the new term */
    $('#token-list').append(`<li><button class='btn'><i class='fa
        fa-close'></i></button>${term}</li>`);

    /* add on click listener for deletion
       if clicked, remove term from frequencies object and redraw plot of terms
    */
    $("#token-disp button").click(function() {
        var term = $(this).parent().text();
        delete frequencies[term];
        $(this).parent().remove();
        plotFrequencies(frequencies);
    });

    /* get data for the term */
    $.getJSON(`./php/get_freq.php?term=${term}`, function(data) {
        frequencies[term] = data;
    }).done(function() {
        /* replot */
        plotFrequencies(frequencies);
        $('#search-button').off('click');
        $('#tokens').val(''); // clear the search bar when token selected
    });
}
