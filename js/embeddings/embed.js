var timeseriesLayout = {
    autosize: true,
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

var timeseriesAnnotations = [
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
        y: 0.4503,
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
        ax: -90,
        ay: -85
    }
]

/* helper function which returns an array of ints given a range */
const range = (start, stop, step = 1) =>
Array(Math.ceil((stop - start) / step)).fill(start).map((x, y) => x + y * step);


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
        var startingLayout = JSON.parse(JSON.stringify(timeseriesLayout));
        startingLayout.annotations = timeseriesAnnotations;
        plotWordChange(term, decades, data.timeseries[0],
            data.decades, neighborsTimeseries, startingLayout);
        plotHist('full', null, data.full, term);
        $("#dropdown-auth").change(function () {
           var author = $(this).val();
           var authName = $("#dropdown-auth option:selected").text();
           plotHist('author', authName, data.authors[author], term);
        });
        $("#dropdown-loc").change(function () {
          var location = $(this).val();
          var locName = $("#dropdown-loc option:selected").text();
          plotHist('location', locName, data.locations[location], term);
        });

        $.getJSON('./resources/sample_kwic.json', function(data) {
            parseKwic(data, 'Abraham'); // change to history
        });
    })

    $.getJSON('./php/get_terms.php', function(terms) {
        $('#tokens').autocomplete({
            delay: 0,
            minLength: 3,
            source: function(request, response) {
                var results = $.ui.autocomplete.filter(terms, request.term)
                response(results.slice(0, 10));
            },
            select: function(e, ui) {
                $('#search-button').on('click', function() {
                    $('#top_docs').toggle()
                    var term = ui.item.value;
                    console.log(ui.item.value);
                    $('#kwic-msg').text('Loading keyword in context data ...');
                    $.getJSON(`./php/get_neighbors.php?term=${term}`, function(data) {
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
                        plotWordChange(term, decades, data.timeseries[0],
                            data.decades, neighborsTimeseries, timeseriesLayout);
                        plotHist('full', null, data.full, term);
                        $("#dropdown-auth").change(function () {
                            var author = $(this).val();
                            var authName = $("#dropdown-auth option:selected").text();
                            plotHist('author', authName, authors[author], term);
                        });
                        $("#dropdown-loc").change(function () {
                            var location = $(this).val();
                            var locName = $("#dropdown-loc option:selected").text();
                            plotHist('location', locName, data.locations[location], term);
                        });
                    })

                    getKwic(term);
                });
            }
        });
    })
    .done(function() {
       histLayout.title = null;
       Plotly.newPlot('auth-hist', null, histLayout, {displayModeBar: false});
       Plotly.newPlot('loc-hist', null, histLayout, {displayModeBar: false});
   });

    $('#tokens').val('');
    $('#dropdown-auth').val('');
    $('#dropdown-loc').val('');
});
