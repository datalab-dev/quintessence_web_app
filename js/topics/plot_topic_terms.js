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
    barmode: 'stack',
    staticPlot: true,
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
                color: 'blue'
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

    console.log(traces);
    topicTermsLayout.sliders = slider;

    //topicTermsLayout.title = 'Topic Terms ' + topicId;
    $('#topic_terms').append('<div id="topic_terms_plot"></div>')
    Plotly.newPlot('topic_terms_plot', traces, topicTermsLayout,
	{staticPlot: true});
}
