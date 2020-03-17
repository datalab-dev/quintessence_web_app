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


const range = (start, stop, step = 1) =>
Array(Math.ceil((stop - start) / step)).fill(start).map((x, y) => x + y * step);


function plotFrequencies(data, raw_data) {
    var decades = range(1480, 1700, 10);
    var traces = [];
    var myWords = Object.keys(data);

    myWords.forEach(function(word) {
        var trace = {
            x: decades,
            y: data[word],
            name: word,
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
	    text: raw_data[word],
            hovertemplate: '(%{x}, %{y:.4f})<br>Raw freq: %{text}',
            hoverlabel: {namelength : 0}
            // width: 800,
            // height: 600
        };
        traces.push(trace);
    });

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
            // layer: 'below traces',
            // range: [0,0.5],
            // dtick: 0.01,
            gridwidth: 1,
            rangemode: 'tozero',
            showticklabels: true,
            ticklen: 1,
            showline: true
        },
        rangemode: 'nonnegative',
        // margin: { r: 0, l: 20, b: 10, t: 20 },
        paper_bgcolor: 'rgb(243, 243, 243)',
        plot_bgcolor: 'rgb(243, 243, 243)',
        showlegend: true,
        hovermode: 'closest',
        width: 1024,
        height: 600
    };

    var nnPlot = document.getElementById('freqPlot');
    Plotly.newPlot('freqPlot', traces, layout, {displayModeBar: false}, {responsive: true});
}


function plotOverallFrequencies(data) {
    var decades = range(1480, 1700, 10);

    var traceWords = {
        x: decades,
        y: data.wordFreqs,
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
        hovertemplate: '%{y:.3s} total words',
        hoverlabel: {namelength : 0}
        // width: 800,
        // height: 600
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
	// width: 800,
        // height: 600
    };

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

    Plotly.newPlot('wordFreqPlot', [traceWords], layout, {displayModeBar: false}, {responsive: true});
    Plotly.newPlot('docFreqPlot', [traceDocs], layout, {displayModeBar: false}, {responsive: true});
}


$(document).ready(function() {
    // Configure tabs
    $('#tabs li a:not(:first)').addClass('inactive');
    $('.container:not(:first)').hide();
    $('#tabs li a').click(function(){
        var t = $(this).attr('href');
        $('#tabs li a').addClass('inactive');
        $(this).removeClass('inactive');
        $('.container').hide();
        $(t).fadeIn('slow');
        return false;

        if($(this).hasClass('inactive')) {
            $('#tabs li a').addClass('inactive');
            $(this).removeClass('inactive');
            $('.container').hide();
            $(t).fadeIn('slow');
        }
    })

    $('#tokens').val('');
    $.getJSON('./resources/words.json', function(data) {
        freq_data = {};
        raw_data = {};

        $('#tokens').autocomplete({
            delay: 0,
            minLength: 3,
            source: function(request, response) {
                var results = $.ui.autocomplete.filter(data.words, request.term)
                response(results.slice(0, 10));
            },
            select: function(e, ui) {
                $('#search-button').on('click', function() {
                    $('#token-list').append(`<li><button class='btn'><i class='fa
                        fa-close'></i></button>${ui.item.value}</li>`);

                    /* add on click listener for deletion */
                    $("#token-disp button").click(function() {
                        var word = $(this).parent().text();
                        delete freq_data[word];
                        delete raw_data[word];
                        $(this).parent().remove();
                        plotFrequencies(freq_data);
                    });

                    /* fetch data */
                    $.getJSON(`./php/fetch_freq.php?word=${ui.item.value}`, function(data) {
                        freq_data[ui.item.value] = data.relFreqs;
                        raw_data[ui.item.value] = data.rawFreqs;
                    }).done(function() {
                        /* replot */
                        plotFrequencies(freq_data, raw_data);
                        $('#search-button').off('click');
                        $('#tokens').val(''); // clear the search bar when token selected
                    });
                });
            }
        });
    })
    .done(function() {
        plotFrequencies(freq_data);
    });

    $.getJSON('./php/fetch_overall_freq.php', function(data) {
        plotOverallFrequencies(data);
    });
});
