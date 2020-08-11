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
    var myterms = Object.keys(data);

    myterms.forEach(function(term) {
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
            text: raw_data[term],
            hovertemplate: '%{y:.2%} of terms Used in %{x} <br>Total Occurrences: %{text:,}',
            hoverlabel: {namelength : 0}
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
            // tickformat = '.2%',
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

    Plotly.newPlot('termFreqPlot', [traceterms], layout, {displayModeBar: false}, {responsive: true});
    Plotly.newPlot('docFreqPlot', [traceDocs], layout, {displayModeBar: false}, {responsive: true});
}


function addterm(term, freq_data, raw_data) {
    $('#token-list').append(`<li><button class='btn'><i class='fa
        fa-close'></i></button>${term}</li>`);

    /* add on click listener for deletion */
    $("#token-disp button").click(function() {
        var term = $(this).parent().text();
        delete freq_data[term];
        delete raw_data[term];
        $(this).parent().remove();
        plotFrequencies(freq_data, raw_data);
    });

    /* get data */
    $.getJSON(`./php/get_freq.php?term=${term}`, function(data) {
        freq_data[term] = data.relFreqs;
        raw_data[term] = data.rawFreqs;
    }).done(function() {
        /* replot */
        plotFrequencies(freq_data, raw_data);
        $('#search-button').off('click');
        $('#tokens').val(''); // clear the search bar when token selected
    });
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
    freq_data = {};
    raw_data = {};

    addterm('history', freq_data, raw_data);

    $.getJSON('./resources/terms.json', function(data) {
        $('#tokens').autocomplete({
            delay: 0,
            minLength: 3,
            source: function(request, response) {
                var results = $.ui.autocomplete.filter(data.terms, request.term)
                response(results.slice(0, 10));
            },
            select: function(e, ui) {
                $('#search-button').on('click', function() {
                    addterm(ui.item.value, freq_data, raw_data);
                });
            }
        });
    });

    $.getJSON('./php/get_overall_freq.php', function(data) {
        plotOverallFrequencies(data);
    });
});
