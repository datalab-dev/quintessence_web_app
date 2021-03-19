/* 

Plots the lda bubble plot for the full corpus.

Gets everything from init_lda_pca.php

For each topic needs:
    id
    x,
    y
    proportion
    topAuthors,
    topLocations, 
    topKeywords

*/

const LDA_PCA_PLOT_NAME = 'ldapca';

/* update the colors of the lda pca plot */
function updateLdaPcaColors(selected, colors, sizes) {
    colors[selected] = '#a91111';
    var update = {
	'marker': {
	    color: colors,
	    size: sizes,
	    line: {
		color: 'black',
		width: 2
	    }
	}
    };
    Plotly.restyle(LDA_PCA_PLOT_NAME, update, 0);
}

function topString(arr) {
    const n = 60; // max length of string
    var s = "";
    for (const elem of arr) {
	str = (elem.length > n) ? elem.substr(0, n-1) + '...' : elem;
	s += `    ${str}<br>`
    }
    return s;
}

/* given the topic data draw the lda pca plot */
function plotLdaPca(topics, topicNum, annotations) {
    var category = $("input[name='category']:checked").val();

    /* generate plot data from topic objects */
    var xs = [], ys = [], sizes = [], ids =[], texts = [], colors = [];
    for (const topic of topics) {
	var proportion = topic['proportion'] * 100;
	ids.push(topic['_id']);
	xs.push(topic['x'] * 100);
	ys.push(topic['y'] * 100);
	sizes.push(proportion * 20);
	texts.push(
	    `Topic: ${topic['_id']}<br>` +
	    `Proportion: ${proportion.toFixed(2)}%<br>` +
	    `${category}: <br>${topString(topic[category])}`);
	colors.push('#1f77b4');
    }
    saved_sizes = sizes;
    saved_colors = colors;

    /* plot data */
    var trace = {
	x: xs,
	y: ys,
	text: ids,
	hovertemplate: texts,
	hoverlabel: {
	    namelength: 0,
	    align: 'left'
	},
	textposition: 'bottom',
	mode: 'markers+text',
	type: 'scatter',
	marker: {
	    size: sizes,
	    color: '#1f77b4',
	    line: {
		color: 'black',
		width: 2
	    }
	}
    }

    if (annotations == false)
	ldaPcaLayout.annotations = null;

    Plotly.newPlot(LDA_PCA_PLOT_NAME, [trace], ldaPcaLayout,
	{displayModeBar: false});
    updateLdaPcaColors(topicNum, colors.slice(0), sizes);
    document.getElementById("selectedTopic").innerHTML = topicNum;

    /* when a topic is selected update colors and plot topic terms */
    var ldaPcaPlot = document.getElementById(LDA_PCA_PLOT_NAME);
    ldaPcaPlot.on('plotly_click', function(data) {
	var pn = data.points[data.points.length - 1].pointNumber;
	updateLdaPcaColors(pn, colors.slice(0), sizes); // copy of colors
	document.getElementById("selectedTopic").innerHTML = pn;

	$.getJSON('./php/get_top_topic_relevance_terms.php?topicId=' + pn.toString(),
	    function(data) {
		plotTopicTerms(pn,data["topterms"]); // pass topic id 
	    });

	$.getJSON('./php/get_topic_proportions.php?topicId=' + pn.toString(), 
	    function(data) {
		plot_topic_proportion(data);
	    });
    });

    document.getElementById("topics").innerHTML = JSON.stringify(topics);
}
