var timeseriesLayout = {
    autosize: false,
    width: 1024,
    height: 550,
    title: ' ',
    xaxis: {
        title: 'Decades',
        gridcolor: 'rgb(243, 243, 243)',
        type: 'linear',
        range: [1470, 1705],
        dtick: 10,
        zerolinewidth: 1,
        ticklen: 1,
	tickfont: {color: 'gray'},
        gridwidth: 1
    },
    yaxis: {
        title: 'term Change',
        gridcolor: 'rgb(243, 243, 243)',
        layer: 'below traces',
        range: [0, 1.05],
        dtick: 0.25,
        gridwidth: 1,
        showticklabels: true,
	tickmode: 'array',
	tickvals: [.25, .50, .75, 1.0],
	ticktext: ['25', '50', '75', '100%'],
	tickfont: {color: 'gray'}
    },
    paper_bgcolor: 'rgb(243, 243, 243)',
    plot_bgcolor: 'rgb(243, 243, 243)',
    showlegend: false,
    hovermode: 'closest',
    displayModeBar: false
};

var startingLayout = {
    autosize: false,
    width: 1024,
    height: 550,
    title: ' ',
    xaxis: {
        title: 'Decades',
        gridcolor: 'rgb(243, 243, 243)',
        type: 'linear',
        range: [1470, 1705],
        dtick: 10,
        zerolinewidth: 1,
        ticklen: 1,
	tickfont: {color: 'gray'},
        gridwidth: 1
    },
    yaxis: {
        title: 'term Change',
        gridcolor: 'rgb(243, 243, 243)',
        layer: 'below traces',
        range: [0, 1.05],
        dtick: 0.25,
        gridwidth: 1,
        showticklabels: true,
    	tickmode: 'array',
    	tickvals: [.25, .50, .75, 1.0],
    	ticktext: ['25', '50', '75', '100%'],
    	tickfont: {color: 'gray'}
    },
    annotations: [
        {
            x: 1700,
            y: 1,
            xref: 'Decades',
            yref: 'term Change',
            text: 'each decade is <br> compared with 1700',
            showarrow: true,
            arrowhead: 6,
            ax: 0,
            ay: -40
        },
        {
            x: 1490,
            y: 0.4763,
            xref: 'Decades',
            yref: 'term Change',
            text: 'lowest point is most <br> different from 1700',
            showarrow: true,
            arrowhead: 6,
            ax: 0,
            ay: 40
        },
        {
            x: 1650,
            y: 0.4636,
            xref: 'Decades',
            yref: 'term Change',
            text: 'terms nearest to <br> term in 1700',
            showarrow: true,
            arrowhead: 6,
            ax: 20,
            ay: 40
        },
        {
            x: 1670,
            y: 0.572,
            xref: 'Decades',
            yref: 'term Change',
            text: '',
            showarrow: true,
            arrowhead: 6,
            ax: -50,
            ay: 56
        },
        {
            x: 1505,
            y: 0.67,
            xref: 'Decades',
            yref: 'term Change',
            text: 'abrupt increase indicates <br> term meaning change',
            showarrow: true,
            arrowhead: 2,
            ax: -30,
            ay: -75
        }
    ],
    //margin: { pad: 20 },
    paper_bgcolor: 'rgb(243, 243, 243)',
    plot_bgcolor: 'rgb(243, 243, 243)',
    showlegend: false,
    hovermode: 'closest',
    displayModeBar: false
};

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


function replaceZero(arr) {
    for (i = 0; i < arr.length; i++) {
        if (arr[i] == "0") {
            arr[i] = null;
        }
    }

    return arr;
}


function get_nninfo(data) {
    var res = "";
    for (i = 19; i > 9; i--) {
        var n = data.neighbors[i];
        var p = (parseFloat(data.scores[i])*100).toFixed(2);
        res = res.concat(n, " - ", p, "%<br>");
    }
    return(res);
}


/* given a term's nerest neighbors in 1700 get traces over time for all */
function get_nn_traces(neighborsTimeseries, decades) {
    var traces = [];
    for (const neighbor of neighborsTimeseries) {
        var y = replaceZero(neighbor.timeseries);
        var trace = {
            x: decades,
            y: y,
            mode: 'lines',
            type: 'scatter',
            line: {
                opacity: 0.7,
                color: 'rgb(128, 128, 128)',
                width: 0.5,
		shape: 'spline'
            },
            hovertext: neighbor.term,
            hoverinfo: 'text',
            // hovertemplate: '%{text}',
            hoverlabel: {namelength :-1}
        }
        traces.push(trace);
    }

    return traces;
}


function plot_hist(category, sel, nn, term) {
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


/* given a term generate term embeddings plots */
function plot_timeseries(term, decades, termTimeseries, decNeighbors,
    neighborsTimeseries, layout) {

    var nninfo = [];

    for (const decade of decades) {
        nninfo.push(get_nninfo(decNeighbors[decade]));
    }

    var nntraces = get_nn_traces(neighborsTimeseries, decades);
    termTimeseries.timeseries = replaceZero(termTimeseries.timeseries);

    var colors = [];
    for (var i = 0; i < decades.length; i++) {
        colors.push('rgb(243, 243, 243)');
    }

    /* plot term change over time */
    var trace1 = {
        x: decades,
        y: termTimeseries.timeseries,
        mode: 'lines+markers',
        type: 'scatter',
        color: 'steelblue',
        line: { opacity: 1, shape: 'spline', color: 'steelblue' },
        marker: {
            color: colors,
            symbol: 'circle',
            sizemode: 'diameter',
            size: 8,
            opacity: 1,
            line: {
                width: 1,
                opacity: 1,
                color: 'steelblue'
            }
        },
        text: nninfo,
        hovertemplate: '<br>Similarity Score: %{y:.2%}<br>Most similar terms:<br>%{text}',
        hoverlabel: {namelength : 0}
    };

    var data1 = [ trace1 ].concat(nntraces);

    var nnPlot = document.getElementById('nn-plot');
    Plotly.newPlot('nn-plot', data1, layout, {displayModeBar: false},
        {showSendToCloud: true});

    /* plot nearest neighbors histogram on click
    nnPlot.on('plotly_click', function(data) {
        var decade = data.points[0].x;
        plot_hist('decade', decade, decNeighbors[decade], term);
    }); */

    /* change the color of a point hovered on */
    nnPlot.on('plotly_hover', function(data) {
    	newColors = [...colors];

        pn = data.points[data.points.length - 1].pointNumber;
        tn = data.points[data.points.length - 1].curveNumber;
        x = data.points[data.points.length - 1].x;
        y = data.points[data.points.length - 1].y;
        newColors[pn] = 'steelblue';

        var update = {'marker': {
            color: newColors,
            size: 8,
            line: {color: 'steelblue', width: 1}
        }};
        Plotly.restyle('nn-plot', update, [tn]);
    });
}


function get_kwic(data, term) {
    var doc_ids_list = [];
    var kwics = [];

    var file_ids = Object.keys(data);
    console.log(file_ids);

    $.get("./php/get_qid.php", { 'fileids[]' : file_ids }, function(data) {
        doc_ids_list = JSON.parse(data);
    }).done(function() {
        for (const doc of Object.keys(data)) {
            var kwic = data[doc].window.replace(data[doc].term, `<b>${data[doc].term}</b>`);
            kwics.push(kwic);
        }

        $.getScript("./js/init_documents_results.js", function() {
            $.getScript("./js/get_meta.js", function() {
                init_documents_results(doc_ids_list, doc_ids_list.length, kwics);
            });
        });
    });
}


function reset() {
    Plotly.newPlot('nn-plot', null, timeseriesLayout, {displayModeBar: false}, {showSendToCloud: true});
    Plotly.newPlot('dec-hist', null, histLayout, {displayModeBar: false}, {showSendToCloud: true});
    Plotly.newPlot('auth-hist', null, histLayout, {displayModeBar: false}, {showSendToCloud: true});
    Plotly.newPlot('loc-hist', null, histLayout, {displayModeBar: false}, {showSendToCloud: true});
    Plotly.newPlot('full-hist', null, histLayout, {displayModeBar: false}, {showSendToCloud: true});
}


$(document).ready(function() {
    /* configure tabs */
    $('#tabs a:not(:first)').addClass('inactive');
    $('.container:not(:first)').hide();
    $('#tabs a').click(function(){
        var t = $(this).attr('href');
        $('#tabs a').addClass('inactive');
        $(this).removeClass('inactive');
        $('.container').hide();
        $(t).fadeIn('slow');

        return false;
    })

    var auth_options = $("#dropdown-auth").html();
    var loc_options = $("#dropdown-loc").html();
    var decades = range(1480, 1710, 10);

    /* load the term 'history' as a sample selection */
    $.getJSON('./resources/sample_embed.json', function(data) {
        $('#tokens').val('history');
        var term = 'history';
        var neighborsTimeseries = data.timeseries.slice(1, data.timeseries.length);
        plot_timeseries(term, decades, data.timeseries[0],
            data.decades, neighborsTimeseries, timeseriesLayout);
        plot_hist('full', null, data.full, term);
        $("#dropdown-auth").change(function () {
           var author = $(this).val();
           var authName = $("#dropdown-auth option:selected").text();
           plot_hist('author', authName, data.authors[author], term);
        });
        $("#dropdown-loc").change(function () {
          var location = $(this).val();
          var locName = $("#dropdown-loc option:selected").text();
          plot_hist('location', locName, data.locations[location], term);
        });
        $.getJSON('./resources/sample_kwic.json', function(data) {
            get_kwic(data, term);
            data = [];
        })
    });

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
                    $('#top_docs').toggle()
                    var term = ui.item.value;
                    console.log(ui.item.value);
                    $('#token-msg').text('Requesting token data ...');
                    $('#kwic-msg').text('Requesting keyterm in context data ...');
                    $.getJSON(`./php/fetch_neighbors.php?term=${term}`, function(data) {
                        /* filter dropdown menus */
                        for(var author in data.authors) {
                            if (data.authors[author].scores.length == 0)
                                $(`#dropdown-auth option[value=\"${author}\"]`).remove();
                        }
                        for(var location in data.locations) {
                            if (data.locations[location].scores.length == 0)
                                $(`#dropdown-loc option[value=\"${location}\"]`).remove();
                        }

                        /* plot */
                        var neighborsTimeseries = data.timeseries.slice(1, data.timeseries.length)
                        plot_timeseries(term, decades, data.timeseries[0],
                            data.decades, neighborsTimeseries, timeseriesLayout);
                        plot_hist('full', null, data.full, term);
                        $("#dropdown-auth").change(function () {
                            var author = $(this).val();
                            var authName = $("#dropdown-auth option:selected").text();
                            plot_hist('author', authName, authors[author], term);
                        });
                        $("#dropdown-loc").change(function () {
                            var location = $(this).val();
                            var locName = $("#dropdown-loc option:selected").text();
                            plot_hist('location', locName, data.locations[location], term);
                        });
                    })
                    .done(function() {
                      $('#token-msg').text('');
                    });
                    $.getJSON(`./php/get_kwic.php?term=${term}`, function(data) {
                        get_kwic(data, term);
                        data = [];
                    })
                    .done(function() {
                        $('#kwic-msg').text('');
                        $('#top_docs').toggle()
                        $('#search-button').off('click');
                    });
                });
            }
        });
    })
    .done(function() {
        histLayout.title = null;
        // Plotly.newPlot('dec-hist', null, histLayout, {showSendToCloud: true});
        Plotly.newPlot('auth-hist', null, histLayout, {displayModeBar: false}, {showSendToCloud: true});
        Plotly.newPlot('loc-hist', null, histLayout, {displayModeBar: false}, {showSendToCloud: true});
    });

    $('#tokens').val('');
    $('#dropdown-auth').val('');
    $('#dropdown-loc').val('');
});
