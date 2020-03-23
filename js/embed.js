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
        title: 'Word Change',
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
        title: 'Word Change',
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
      yref: 'Word Change',
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
      yref: 'Word Change',
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
      yref: 'Word Change',
      text: 'terms nearest to <br> word in 1700',
      showarrow: true,
      arrowhead: 6,
      ax: 20,
      ay: 40
    },
    {
      x: 1670,
      y: 0.572,
      xref: 'Decades',
      yref: 'Word Change',
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
      yref: 'Word Change',
      text: 'abrupt increase indicates <br> word meaning change',
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


/* given a word's nerest neighbors in 1700 get traces over time for all */
function get_nn_traces(neighbors, neighborsTimeseries, decades) {
    var traces = [];

    neighbors.forEach(function(word) {
        if (neighborsTimeseries[word] == null) {
            return;
        }

        var y = replaceZero(neighborsTimeseries[word]);
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
            hovertext: word,
            hoverinfo: 'text',
            // hovertemplate: '%{text}',
            hoverlabel: {namelength :-1}
        }
        traces.push(trace);
    });

    return traces;
}


function plot_hist(category, sel, nn, word) {
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
            var title = `Most similar to "${word}" in ${sel}`;
            element = 'dec-hist';
            break;
        case 'author':
            var title = `Most similar to "${word}" in texts by ${sel}`;
            element = 'auth-hist';
            break;
        case 'location':
            var title = `Most similar to "${word}" in texts from ${sel}`;
            element = 'loc-hist';
            break;
        case 'full':
            var title = `Most similar to "${word}" in all texts`;
            element = 'full-hist';
            break;
    }

    var authHistLayout = histLayout;
    authHistLayout.title = title;
    authHistLayout.yaxis = {
        title: '',
        dtick: 1
    };
    Plotly.newPlot(element, [trace], authHistLayout, {displayModeBar: false}, {showSendToCloud: true});
}


/* given a word generate word embeddings plots */
function plot_timeseries(word, decades, wordTimeseries, decNeighbors,
    neighborsTimeseries, layout) {

    var nninfo = [];

    decades.forEach(function(decade) {
        nninfo.push(get_nninfo(decNeighbors[decade]));
    });
    console.log(nninfo);
    console.log(decNeighbors);

    var nntraces = get_nn_traces(decNeighbors[1700].neighbors,
        neighborsTimeseries, decades);
    console.log(nntraces);

    wordTimeseries = replaceZero(wordTimeseries);

    var colors = [];
    for (var i = 0; i < decades.length; i++) {
        colors.push('rgb(243, 243, 243)');
    }

    /* plot word change over time */
    var trace1 = {
        x: decades,
        y: wordTimeseries,
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
        hovertemplate: '<br>Similarity Score: %{y:.2%}<br>Most similar words:<br>%{text}',
        hoverlabel: {namelength : 0}
    };

    var data1 = [ trace1 ].concat(nntraces);

    var nnPlot = document.getElementById('nn-plot');
    Plotly.newPlot('nn-plot', data1, layout, {displayModeBar: false}, {showSendToCloud: true});

    /* plot nearest neighbors histogram on click
    nnPlot.on('plotly_click', function(data) {
        var decade = data.points[0].x;
        plot_hist('decade', decade, decNeighbors[decade], word);
    }); */

    /* change the color of a point hovered on */
    nnPlot.on('plotly_hover', function(data) {
    	newColors = [...colors];

        pn = data.points[data.points.length - 1].pointNumber;
        tn = data.points[data.points.length - 1].curveNumber;
        x = data.points[data.points.length - 1].x;
        y = data.points[data.points.length - 1].y;
        newColors[pn] = 'steelblue';

        // console.log("pn: "+ pn);
        // console.log(x + "+" + y);

        var update = {'marker': {
            color: newColors,
            size: 8,
            line: {color: 'steelblue', width: 1}
        }};
        Plotly.restyle('nn-plot', update, [tn]);
    });
}


function get_kwic(data, word) {
    var doc_ids_list = [];
    var kwics = [];

    var file_ids = Object.keys(data);
    console.log(file_ids);

    $.get("./php/get_qid.php", { 'fileids[]' : file_ids }, function(data) {
        doc_ids_list = JSON.parse(data);
    }).done(function() {
        Object.keys(data).forEach(function(doc) {
            var kwic = data[doc].window.replace(data[doc].word, `<b>${data[doc].word}</b>`);
            kwics.push(kwic);
        });

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

    var auth_options = $("#dropdown-auth").html();
    var loc_options = $("#dropdown-loc").html();

    /* load the word 'history' as a sample selection */
    $.getJSON('./resources/sample_embed.json', function(data) {
        $('#tokens').val('history');
        var word = 'history';
        plot_timeseries(word, decades, data.wordTimeseries,
            data.decNeighbors, data.neighborsTimeseries, startingLayout);
        plot_hist('full', null, data.fullNeighbors["full"], word);
        $("#dropdown-auth").change(function () {
           var author = $(this).val();
           var authName = $("#dropdown-auth option:selected").text();
           plot_hist('author', authName, data.authNeighbors[author], word);
        });
        $("#dropdown-loc").change(function () {
          var location = $(this).val();
          var locName = $("#dropdown-loc option:selected").text();
          plot_hist('location', locName, data.locNeighbors[location], word);
        });
        $.getJSON('./resources/sample_kwic.json?v=3', function(data) {
            get_kwic(data, word);
            data = [];
        })
    });

    var decades = range(1480, 1710, 10);

    $.getJSON('./resources/words.json', function(data) {
        $('#tokens').autocomplete({
            delay: 0,
            minLength: 3,
            source: function(request, response) {
                var results = $.ui.autocomplete.filter(data.words, request.term)
                response(results.slice(0, 10));
            },
            select: function(e, ui) {
                $('#search-button').on('click', function() {
                    $('#top_docs').toggle()
                    var word = ui.item.value;
                    console.log(ui.item.value);
                    $('#token-msg').text('Requesting token data ...');
                    $('#kwic-msg').text('Requesting keyword in context data ...');
                    $.getJSON(`./php/fetch_all.php?word=${word}`, function(data) {
                        /* filter dropdown menus */
                        for(var author in data.authNeighbors) {
                            if (data.authNeighbors[author].scores.length == 0) {
                                $(`#dropdown-auth option[value=\"${author}\"]`).remove();
                            }
                        }
                        for(var location in data.locNeighbors) {
                            if (data.locNeighbors[location].scores.length == 0) {
                                $(`#dropdown-loc option[value=\"${location}\"]`).remove();
                            }
                        }

                        /* plot */
                        plot_timeseries(word, decades, data.wordTimeseries,
                            data.decNeighbors, data.neighborsTimeseries, timeseriesLayout);
                        plot_hist('full', null, data.fullNeighbors["full"], word);
                        $("#dropdown-auth").change(function () {
                           var author = $(this).val();
                           var authName = $("#dropdown-auth option:selected").text();
                           plot_hist('author', authName, data.authNeighbors[author], word);
                       });
                       $("#dropdown-loc").change(function () {
                          var location = $(this).val();
                          var locName = $("#dropdown-loc option:selected").text();
                          plot_hist('location', locName, data.locNeighbors[location], word);
                      });
                    })
                    .done(function() {
                      $('#token-msg').text('');
                    });
                    $.getJSON(`./php/fetch_kwic.php?word=${word}`, function(data) {
                        get_kwic(data, word);
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
        // $('#autocomplete').val('');
        // Plotly.newPlot('nn-plot', null, timeseriesLayout, {showSendToCloud: true});
        // Plotly.newPlot('dec-hist', null, histLayout, {showSendToCloud: true});
        histLayout.title = null;
        Plotly.newPlot('auth-hist', null, histLayout, {displayModeBar: false}, {showSendToCloud: true});
        Plotly.newPlot('loc-hist', null, histLayout, {displayModeBar: false}, {showSendToCloud: true});
        // Plotly.newPlot('full-hist', null, histLayout, {showSendToCloud: true});
    });

    $('#tokens').val('');
    $('#dropdown-auth').val('');
    $('#dropdown-loc').val('');
    //$( "#tabs" ).tabs();
});
