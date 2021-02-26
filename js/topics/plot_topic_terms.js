/*

Plots the top terms for a given topic

Gets everything from get_top_topic_terms.php

Needs:
    TopicId
    Object{
        scores: [ ],
        terms: [ ]
    }

*/

var topicTermsLayout = {
    staticPlot: true,
    autosize: false,
    height: 900,
    width: 300,
    plot_bgcolor: 'rgb(243,243,243)',
    margin: {
        l: 120,
        r: 0,
        b: 50,
        t: 50,
        pad: 0
    },
    xaxis: {
        autorange: true,
        showgrid: false,
        zeroline: false,
        showline: false,
        autotick: true,
        ticks: '',
        showticklabels: false
    },
    yaxis: {
        autorange: "reversed",
        showgrid: false,
        zeroline: false,
        showline: false,
        autotick: true,
        ticks: '',
        showticklabels: true
    }
};

function plotTopicTerms(topicId, topTerms) {
    /* generate plot data from top term objects */
    var terms = topTerms['terms']; 
    var scores = topTerms['scores'];

    /* plot topic terms */
    var trace = {
        x: scores,
        y: terms,
        type: 'bar',
        orientation: 'h',
	    opacity: 0.7,
	    marker: {
           color: '#a91111'
	    }
    }
    topicTermsLayout.title = 'Topic Terms ' + topicId;
    $('#topic_terms').append('<div id="topic_terms_plot"></div>')
    Plotly.newPlot('topic_terms_plot', [trace], topicTermsLayout,
        {staticPlot: true});
}
