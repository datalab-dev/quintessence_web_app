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
const DEFAULT_TOPIC = 25;

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
    $.getJSON('./php/get_top_topic_terms.php?topicId=' + DEFAULT_TOPIC.toString(),
	function(data) {
            plotTopicTerms(DEFAULT_TOPIC, data);
    })
});
