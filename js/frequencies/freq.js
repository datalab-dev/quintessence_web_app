/*

Controls generating and updating the plots for corpus.html
Plots:
1. Relative Frequency (plot_freq.js)
2. Terms per year     (plot_overall_freq.js)
3. Documents per year (plot_overall_freq.js)

Calls to php:
get_terms.php
get_overall_freq.php
get_freq.php

*/

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

    /* add terms and documents per year plots */
    $.getJSON('./php/get_overall_freq.php', function(data) {
	plotOverallFrequencies(data.word_count, data.doc_count);
    });


    /* Relative Frequency plot controls 

       plot term 'history' as demo
       add autocomplete to input for terms (uses terms from php/get_terms.php
       */

    $('#tokens').val('');
    frequencies = {} // init empty object to hold the data for each term

    addTermFreq('history', frequencies);

    $.getJSON('./php/get_terms.php', function(terms) {
	$('#tokens').autocomplete({
	    delay: 0,
	    minLength: 3,
	    source: function(request, response) {
		var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( request.term ), "i" );
		response( $.grep( terms, function( item ){
		    return matcher.test( item );
		}) );
	    },
	    select: function(e, ui) {
		addTermFreq(ui.item.value, frequencies);
	    }
	});
    });
});
