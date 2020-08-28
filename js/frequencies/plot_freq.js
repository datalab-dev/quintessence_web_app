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
        title: 'Relative Frequency (%)',
        gridcolor: 'rgb(243, 243, 243)',
        gridwidth: 1,
        rangemode: 'tozero',
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


function plotFrequencies(data, rawData) {
    var decades = range(1480, 1700, 10);
    var traces = [];
    var myterms = Object.keys(data);

    for (const term of myterms) {
        var trace = {
            x: decades,
            y: data[term],
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
            text: rawData[term],
            hovertemplate: '%{y:.2%} of terms Used in %{x} <br>Total Occurrences: %{text:,}',
            hoverlabel: {namelength : 0}
        };
        traces.push(trace);
    }

    var nnPlot = document.getElementById('freqPlot');
    Plotly.newPlot('freqPlot', traces, layout, {displayModeBar: false}, {responsive: true});
}


function addTermFreq(term, freqData, rawData) {
    $('#token-list').append(`<li><button class='btn'><i class='fa
        fa-close'></i></button>${term}</li>`);

    /* add on click listener for deletion */
    $("#token-disp button").click(function() {
        var term = $(this).parent().text();
        delete freqData[term];
        delete rawData[term];
        $(this).parent().remove();
        plotFrequencies(freqData, rawData);
    });

    /* get data */
    $.getJSON(`./php/get_freq.php?term=${term}`, function(data) {
        freqData[term] = data.relFreqs;
        rawData[term] = data.rawFreqs;
    }).done(function() {
        /* replot */
        plotFrequencies(freqData, rawData);
        $('#search-button').off('click');
        $('#tokens').val(''); // clear the search bar when token selected
    });
}
