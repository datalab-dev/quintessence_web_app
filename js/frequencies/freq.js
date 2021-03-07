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

    var smoothing= $('#smoothing-select').val();
    $('#smoothing-select').on('change', function() {
	smoothing = $('#smoothing-select').val();
	plotFrequencies(frequencies, smoothing);
    });

    // Autocomplete
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
		addTermFreq(ui.item.value, frequencies, smoothing);
	    }
	});
    });

    // plot history as an example
    $('#tokens').val('');
    frequencies = {} // init empty object to hold the data for each term
    addTermFreq('history', frequencies, smoothing);
});

function addTermFreq(term, frequencies, smoothing) {
    /**
     * Add term to the relative frequency plot
     *
     * @param  {string} term word to plot
     * @param  {object} frequencies object containing data for each term
     * @param  {int} smoothing the level for smoothing
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
	plotFrequencies(frequencies, smoothing);
    });

    /* get data for the term */
    $.getJSON(`./php/get_freq.php?term=${term}`, function(data) {
	data["freq"] = filter_range(data["freq"]);
	data["relFreq"] = filter_range(data["relFreq"]);
	frequencies[term] = data;
    }).done(function() {
	/* replot */
	plotFrequencies(frequencies, smoothing);
	$('#search-button').off('click');
	$('#tokens').val(''); // clear the search bar when token selected
    });
}

const range = (start, stop, step = 1) =>
    Array(Math.ceil((stop - start) / step)).fill(start).map((x, y) => x + y * step);

function moving_average( array, window) {
    // window is number of datapoints on each side to include
    window = parseInt(window);
    let results = [];
    for (var i =0; i < array.length; i++) {
	let start = Math.max(0, i - window);
	let end = Math.min(array.length-1, i + window); 

	// since end is not included in slice add 1
	let slice = array.slice(
	    start,
	    end + 1
	);
	let mean = slice.reduce((a, b) => a + b, 0) / slice.length;
	results[i] = mean;
    }
    return results;
}
function filter_range( obj) {
    let result = {}, key;
    let dates = range(1470, 1700);
    dates = dates.map(String)

    for (key in obj) {
	if (dates.includes(key))  {
	    result[key] = obj[key];
	}
    }
    return result;
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
