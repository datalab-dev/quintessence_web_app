/*

Controls generating and updating the plots for subsets.html
Plots:
1. LDA Bubble plot (plot_lda_pca.js)
2. Top Terms (plot_top_terms.js)

Calls to php:
get_init_lda_pca.php
get_subset_options.php
get_subset_lda.php

*/
var  LDA_PCA_PLOT_NAME = 'ldapca-plot';
var  TOPIC_TERMS_PLOT_NAME = 'topic_terms_plot';
var  TOPIC_PROPORTIONS_PLOT_NAME = 'topic_proportions_plot';

var CATEGORY_FORM_NAME = "categoryhover";
var TOPIC_FORM_NAME = "topic-input";
var TERM_FORM_NAME = "term-input";
var RESET_BUTTON_NAME = "reset-bubbles";

var DETAILS_TAB_NAME = "topicdetails_tabs";
var DETAILS_TAB_CONTAINER_NAME = "container_details";

const NTOPICS = 75;
const DEFAULT_TOPIC = 25;

var topicsdata = {};
var topicnum = DEFAULT_TOPIC;
var cached_sizes = {};
var cached_topic_data = {};

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
    });

    /* configure topicsdetails tabs */
    $('#' + DETAILS_TAB_NAME + ' li a:not(:first)').addClass('inactive');
    $('.' + DETAILS_TAB_CONTAINER_NAME +':not(:first)').hide();
    $('#' + DETAILS_TAB_NAME + ' li a').click(function(){
	var t = $(this).attr('href');
	$('#' + DETAILS_TAB_NAME + ' li a').addClass('inactive');
	$(this).removeClass('inactive');
	$('.' + DETAILS_TAB_CONTAINER_NAME).hide();
	$(t).fadeIn('slow');
	return false;
    });

    /* plot lda_pca with initial data and default topic selected */
    $.getJSON('./php/get_topics_info_all.php', function(data) {
	plotLdaPcaDecades(data, DEFAULT_TOPIC, annotations=true);
    });

    /* user selects which info to see in hover of bubble plot */
    $('#' + CATEGORY_FORM_NAME).on('selectmenuchange', function(e, ui) {
	updateHoverInfo();
    });

    /* plot top terms for the default topic */
    $.getJSON('./php/get_topic_info.php?topicId=' + DEFAULT_TOPIC.toString(),
        function(data) {
            cached_topic_data = data;
	    update_topics_info(DEFAULT_TOPIC, data);

	});

            $('#decade_dropdown').on('selectmenuchange', function(e, ui) {
                var decade = ui.item.value;
                update_tables(cached_topic_data, decade);
            });


    /* autocomplete for topic */
    $.getJSON('./php/get_topics.php', function(topics) {
	topics = topics.map(String);
	$('#' + TOPIC_FORM_NAME).autocomplete({
	    delay: 0,
	    minLength: 1,
	    source: function(request, response) {
		var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( request.term ), "i" );
		response( $.grep( topics, function( item ){
		    return matcher.test( item );
		}) );
	    },
	    select: function(e, ui) {
		var topic = ui.item.value;
		topicnum = topic;
		document.getElementById("selectedTopic").innerHTML = topic;

                $.getJSON('./php/get_topic_info.php?topicId=' + topicnum.toString(),
                    function(data) {
			cached_topic_data = data;
	                update_topics_info(topicnum, data);
	            });

		updateColors(topic); //pass a copy
	    }
	});
    }); //topic autocomplete

    $('#prev').on('click', function() {
	topicnum = topicnum - 1;
	document.getElementById("topic-input").setAttribute("placeholder", topicnum);
	document.getElementById("selectedTopic").innerHTML = topicnum;
        $.getJSON('./php/get_topic_info.php?topicId=' + topicnum.toString(),
                function(data) {
			cached_topic_data = data;
	                update_topics_info(topicnum, data);
	            });

		updateColors(topicnum); //pass a copy
    });
    $('#next').on('click', function() {
	topicnum = topicnum + 1;
	document.getElementById("topic-input").setAttribute("placeholder", topicnum);
	document.getElementById("selectedTopic").innerHTML = topicnum;
        $.getJSON('./php/get_topic_info.php?topicId=' + topicnum.toString(),
                function(data) {
			cached_topic_data = data;
	                update_topics_info(topicnum, data);
	            });

		updateColors(topicnum); //pass a copy
    });

    /* autocomplete for term */
    $.getJSON('./php/get_topics_terms.php', function(terms) {
	$('#' + TERM_FORM_NAME).autocomplete({
	    delay: 0,
	    minLength: 1,
	    source: function(request, response) {
		var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( request.term ), "i" );
		response( $.grep( terms, function( item ){
		    return matcher.test( item );
		}) );
	    },
	    select: function(e, ui) {
		var term = ui.item.value;
		// get topics dist
		$.getJSON('./php/get_topic_terms_dist.php?term=' + term,
		    function(data) {
			// update sizes of ldapca plot
			var proportions = []
			for (var i = 0; i < data.length; i++) {
			    proportions[i] = Math.min(data[i] * 100 * 20, 250);
			}
			var update = {
			    'marker.size': [proportions],
			}
			Plotly.restyle(LDA_PCA_PLOT_NAME, update, 0);
		    }
		);

	    }
	});
    }); //term autocomplete

    $('#' + RESET_BUTTON_NAME).on("click", function(d) {
	topicnum = DEFAULT_TOPIC;
	$("#topic-input")[0].selectedIndex = 0;
	resetLdaPcaDecades();
        $.getJSON('./php/get_topic_info.php?topicId=' + topicnum.toString(),
            function(data) {
                cached_topic_data = data;
    	    update_topics_info(topicnum, data);
    
    	});
    });

});


function getDecade() {
    var slider_labels = document.getElementsByClassName("slider-label");

    for (var i = 0; i < slider_labels.length; i++) {
	var test = slider_labels[i].innerHTML.split(':');
	if (test[0] === "Decade") {
	    return test[1];
	}
    }
}
