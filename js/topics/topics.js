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
const LDA_PCA_PLOT_NAME = 'ldapca';
const DEFAULT_TOPIC = 25;
var saved_sizes = []; // to be accessed and updated anywhere
var saved_colors = []; // to be accessed and updated anywhere

$(document).ready(function() {
    /* fills in dropdown menus for subsetting corpus (Locations, Authors...) */
    initSubsetOptions();

    /* plot lda_pca with initial data and default topic selected */
    $.getJSON('./php/get_init_lda.php', function(data) {
	plotLdaPca(data, DEFAULT_TOPIC, annotations=true);
    });

    /* user selects which info to see in hover of bubble plot */
    $('#category-form input').on('change', function() {
	var topics = JSON.parse(document.getElementById("topics").innerHTML);
	var topicNum = document.getElementById("selectedTopic").innerHTML;
	plotLdaPca(topics, topicNum, annotations = false);
    });

    /* plot top terms for the default topic */
    //$.getJSON('./php/get_top_topic_terms.php?topicId=' + DEFAULT_TOPIC.toString(),
    $.getJSON('./php/get_top_topic_relevance_terms.php?topicId=' + DEFAULT_TOPIC.toString(),
	function(data) {
            plotTopicTerms(DEFAULT_TOPIC, data["topterms"]);
    })
    /* plot topic proportions time series for the default topic */
    $.getJSON('./php/get_topic_proportions.php?topicId=' + DEFAULT_TOPIC.toString(),
	function(data) {
            plot_topic_proportion(data);
	}
    );

    /* autocomplete for topic */
    $.getJSON('./php/get_topics.php', function(topics) {
	topics = topics.map(String);
	$('#topic-input').autocomplete({
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
		document.getElementById("selectedTopic").innerHTML = topic;

		$.getJSON('./php/get_top_topic_relevance_terms.php?topicId=' + topic,
		    function(data) {
			plotTopicTerms(topic, data["topterms"]);
		    });

		updateLdaPcaColors(topic, [...saved_colors], saved_sizes); //pass a copy
	    }
	});
    }); //topic autocomplete

    /* autocomplete for term */
    $.getJSON('./php/get_topics_terms.php', function(terms) {
	$('#term-input').autocomplete({
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
			Plotly.restyle("ldapca", update, 0);
		    }
		);

	    }
	});
    }); //term autocomplete

    $('#reset-bubbles').on("click", function(d) {
	var update = {
	    'marker.size': [saved_sizes],
	}
	Plotly.restyle("ldapca", update, 0);


		document.getElementById("selectedTopic").innerHTML = DEFAULT_TOPIC;

		$.getJSON('./php/get_top_topic_relevance_terms.php?topicId=' + DEFAULT_TOPIC,
		    function(data) {
			plotTopicTerms(DEFAULT_TOPIC, data["topterms"]);
		    });

		updateLdaPcaColors(DEFAULT_TOPIC, [...saved_colors], saved_sizes); //pass a copy

    });

});
