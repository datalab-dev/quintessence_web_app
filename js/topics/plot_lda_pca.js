
/* 

Plots the lda bubble plot for the full corpus 

*/


/* given the topic data draw the lda pca plot */
function plotLdaPca(topics_info, topicNum, annotations) {
    var category = $( "#" + CATEGORY_FORM_NAME ).val();

    var data = get_timeslot_data(topics_info["timeslots"]["full"]);
    var coordinates = get_xy(topics_info["coordinates"]);

    // main trace (full corpus)
    var trace = {
	x: coordinates["x"],
	y: coordinates["y"],
	text: data["ids"],
	hovertemplate: data["fullinfo"][category],
	customdata: [data["fullinfo"], 'full'],
	hoverlabel: {
	    namelength: 0,
	    align: 'left'
	},
	textposition: 'bottom',
	mode: 'markers+text',
	type: 'scatter',
	marker: {
	    size: data["bubblesizes"],
	    color: data["colors"],
	    line: {
		color: 'black',
		width: 2
	    }
	}
    }

    if (annotations == false)
	ldaPcaLayout.annotations = null;

    Plotly.newPlot(LDA_PCA_PLOT_NAME, {
	data: [trace],
	layout: ldaPcaLayout,
    },
	{displayModeBar: false});

    cached_sizes = data["bubblesizes"];
    updateColors(topicNum);
    document.getElementById("selectedTopic").innerHTML = topicNum;

    // when a topic is selected update colors and plot topic terms 
    var ldaPcaPlot = document.getElementById(LDA_PCA_PLOT_NAME);
    ldaPcaPlot.on('plotly_click', function(data) {
	var pn = data.points[data.points.length - 1].pointNumber;
	topicnum = pn;
	updateColors(pn);

	$.getJSON('./php/get_topic_info.php?topicId=' + pn.toString(),
	    function(data) {
		update_topics_info(pn,data); // pass topic id 
	    });

    });

    topicsdata = topics_info;
}
