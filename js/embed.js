const categories = {
    DECADE: 'decade',
    AUTHOR: 'author',
    LOCATION: 'location'
}


var timeseriesLayout = {
    title: ' ',
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
        title: 'Word Change',
        gridcolor: 'rgb(243, 243, 243)',
        layer: 'below traces',
        range: [0, 1.25],
        dtick: 0.25,
        gridwidth: 1,
        showticklabels: false
    },
    // margin: { r: 0, l: 20, b: 10, t: 20 },
    paper_bgcolor: 'rgb(243, 243, 243)',
    plot_bgcolor: 'rgb(243, 243, 243)',
    showlegend: false,
    hovermode: 'closest',
    // width: 930,
    height: 350,
    autosize: true,
};


var histLayout = {
    width: 500,
    height: 300,
    barmode: 'stack',
    title: null,
    xaxis: {
        title: '',
        type: 'log',
        showgrid: false,
        showline: false,
        showticklabels: false,
        zeroline: false
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
    autosize: true
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
        var y = replaceZero(neighborsTimeseries[word]);
        var trace = {
            x: decades,
            y: y,
            mode: 'lines',
            type: 'scatter',
            line: {
                opacity: 0.7,
                color: 'rgb(128, 128, 128)',
                width: 0.5
            },
            hovertext: word,
            hoverinfo: 'text',
            // hovertemplate: '%{text}',
            hoverlabel: {namelength :-1},
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
    Plotly.newPlot(element, [trace], authHistLayout, {showSendToCloud: true});
}


/* given a word generate word embeddings plots */
function plot_timeseries(word, decades, wordTimeseries, decNeighbors,
    neighborsTimeseries) {
    var nninfo = [];

    decades.forEach(function(decade) {
        nninfo.push(get_nninfo(decNeighbors[decade]));
    });

    var nntraces = get_nn_traces(decNeighbors[1700].neighbors,
        neighborsTimeseries, decades);
    wordTimeseries = replaceZero(wordTimeseries);

    /* plot word change over time */
    var trace1 = {
        x: decades,
        y: wordTimeseries,
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
        line: { opacity: 1 },
        color: 'steelblue3',
        text: nninfo,
        hovertemplate: '<br>Most similar words:<br>%{text}',
        hoverlabel: {namelength : 0}
    };

    var data1 = [ trace1 ].concat(nntraces);

    var nnPlot = document.getElementById('nn-plot');
    Plotly.newPlot('nn-plot', data1, timeseriesLayout, {showSendToCloud: true});

    /* plot nearest neighbors histogram on click */
    nnPlot.on('plotly_click', function(data) {
        var decade = data.points[0].x;
        plot_hist('decade', decade, decNeighbors[decade], word);
    });
}


function get_kwic(data, word) {
    console.log(data);
    Object.keys(data).forEach(function(doc) {
        var kwic = data[doc].window.replace(data[doc].word, `<b>${data[doc].word}</b>`);
        $('#kwic-list').append(
            `<li class="list-group-item">
                <h4>${doc}</h4>
                <p>${kwic}</p>
            </li>`
        );
    });
}


function reset() {
    Plotly.newPlot('nn-plot', null, timeseriesLayout, {showSendToCloud: true});
    Plotly.newPlot('dec-hist', null, histLayout, {showSendToCloud: true});
    Plotly.newPlot('auth-hist', null, histLayout, {showSendToCloud: true});
    Plotly.newPlot('loc-hist', null, histLayout, {showSendToCloud: true});
    Plotly.newPlot('full-hist', null, histLayout, {showSendToCloud: true});
}


$(document).ready(function() {
    /* load the word 'power' as a sample selection */
    $.getJSON('./resources/power_embed.json', function(data) {
        $('#tokens').val('power');
        var word = 'power';
        plot_timeseries(word, decades, data.wordTimeseries,
            data.decNeighbors, data.neighborsTimeseries);
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
        $.getJSON('./resources/power_kwic.json?v=2', function(data) {
            get_kwic(data, word);
        })
    });

    $('#sel-filter').change(function(){
        var selectedVal = $("input[name='filter']:checked").val();
        // alert(selectedVal);
        $( "#auth-container" ).toggle();
        $( "#loc-container" ).toggle();
        histLayout.title = "";
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
                    $('#kwic-list').empty();
                    var word = ui.item.value;
                    console.log(ui.item.value);
                    $('#token-msg').text('Requesting token data ...');
                    $('#kwic-msg').text('Requesting keyword in context data ...');
                    $.getJSON(`./php/fetch_all.php?word=${word}`, function(data) {
                        plot_timeseries(word, decades, data.wordTimeseries,
                            data.decNeighbors, data.neighborsTimeseries);
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
        // Plotly.newPlot('auth-hist', null, histLayout, {showSendToCloud: true});
        // Plotly.newPlot('loc-hist', null, histLayout, {showSendToCloud: true});
        // Plotly.newPlot('full-hist', null, histLayout, {showSendToCloud: true});
    });

    $('#tokens').val('');
    $('#dropdown-auth').val('');
    $('#dropdown-loc').val('');
    $( "#tabs" ).tabs();
});
