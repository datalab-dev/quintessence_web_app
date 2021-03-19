/*

Plots the top terms for a given topic

Gets everything from get_top_topic_relevance_terms.php

needs topterms object containing top terms for each lambda as well as the other
stats such as overallFreq, topicFreq, and relevance scores


*/

var topicTermsLayout = {
    barmode: 'stack',
    staticPlot: false,
    autosize: false,
    showlegend: false,
    height: 900,
    width: 500,
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
	fixedrange: true,
	showgrid: false,
	zeroline: false,
	showline: false,
	autotick: true,
	ticks: '',
	showticklabels: true
    },
};

function plotTopicTerms(topicId, topterms) {
    /* generate plot data from top term objects */

    // create traces
    // add traces 2 for each lambda:
    // steps determine which 2 traces are displayed

    var traces = [];
    for (var i = 0; i < topterms.length; i++) {
	let terms = topterms[i]['terms'];
	let overallFreq = topterms[i]['overallFreq'];
	let topicFreq = topterms[i]['estimatedTermFreqTopic'];
	let relevances = topterms[i]['relevances'];

	let diff = [];
	for (var j = 0; j < overallFreq.length; j++) {
	    diff.push(overallFreq[j] - topicFreq[j]);
	}

	/* plot topic terms */
	let trace = {
	    x: topicFreq,
	    y: terms,
	    visible: false,
	    type: 'bar',
	    orientation: 'h',
	    opacity: 0.7,
	    marker: {
		color: '#a91111'
	    }
	}

	let trace2 = {
	    x: diff,
	    y: terms,
	    visible: false,
	    type: 'bar',
	    orientation: 'h',
	    opacity: 0.7,
	    marker: {
		color: '#1f77b4'
	    }
	}
	traces.push(trace);
	traces.push(trace2);
    }

    var mysteps = [];
    for (var i = 0; i < topterms.length; i++) {
	let visibility = Array(traces.length).fill(false) ;
	visibility[i*2] = true;
	visibility[i*2 + 1] = true;
	var step = {
	    label: topterms[i]["lambda"],
	    method: 'update',
	    args: [{'visible': visibility}]
	}
	mysteps.push(step);
    }

    traces[20].visible = true;
    traces[21].visible = true;

    var slider =  [{
	pad: {t: 5, b:0},
	x: 0,
	y: 1.15,
	active: 10,
	currentvalue: {
	    xanchor: 'right',
	    prefix: 'lambda: ',
	    font: {
		color: '#888',
		size: 20
	    }
	},
	steps: mysteps
    }]

    topicTermsLayout.sliders = slider;

    //topicTermsLayout.title = 'Topic Terms ' + topicId;
    $('#topic_terms').append('<div id="topic_terms_plot"></div>')
    Plotly.newPlot('topic_terms_plot', traces, topicTermsLayout);


    var toptermsPlot = document.getElementById('topic_terms_plot');
    toptermsPlot.on('plotly_afterplot', function(data) {
	Plotly.d3.selectAll("#topic_terms_plot .yaxislayer-above").selectAll('text')
	    .on("mouseover", function(d) {
		console.log($(this));
		$(this).css({"font-size":'24px'});
		$(this).css({"font-style":'italic'});

		term = d.text;

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

	    })

	.on("mouseleave", function(d) {
		$(this).css({"font-size":'12px'});
		$(this).css({"font-style":''});
			var update = {
			    'marker.size': [saved_sizes],
			}
			Plotly.restyle("ldapca", update, 0);
	});
    });

}
