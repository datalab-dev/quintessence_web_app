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
    })

    $('#tokens').val('');
    freqData = {};
    rawData = {};

    addTermFreq('history', freqData, rawData);

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
                    addTermFreq(ui.item.value, freqData, rawData);
                });
            }
        });
    });

    $.getJSON('./php/get_overall_freq.php', function(data) {
        plotOverallFrequencies(data);
    });
});
