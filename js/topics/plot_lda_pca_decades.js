/* 

Plots the lda bubble plot for the full corpus and all decades.


/* given the topic data draw the lda pca plot */
function plotLdaPca(topics_info, topicNum, annotations) {
    var category = $( "#" + CATEGORY_FORM_NAME ).val();

    // helper functions
    function get_xy(coordinates) {
	// where coordinates is array of [x,y] arrays
	var x = [];
	var y = [];
	for (var i = 0; i < NTOPICS; i++) {
	    x.push(coordinates[i][0] * 100);
	    y.push(coordinates[i][1] * 100);
	}
	return {
	    "x": x,
	    "y": y}
    }

    function get_hover_text(topics_info_record) {
	// gets data for a single timeslot
	var fullinfo = {};
	fullinfo["topAuthors"] = [];
	fullinfo["topKeywords"] = [];
	fullinfo["topLocations"] = [];

	for (var i=0; i < NTOPICS; i++) {
	    var prop = topics_info_record["proportions"][i] * 100;
	    fullinfo["topAuthors"].push(
		`Topic: ${i}<br>` +
		`Proportion: ${prop.toFixed(2)}%<br>` +
		`Top Authors: <br>${topString(topics_info_record["topAuthors"][i])}`);
	    fullinfo["topKeywords"].push(
		`Topic: ${i}<br>` +
		`Proportion: ${prop.toFixed(2)}%<br>` +
		`Top Keywords: <br>${topString(topics_info_record["topKeywords"][i])}`);
	    fullinfo["topLocations"].push(
		`Topic: ${i}<br>` +
		`Proportion: ${prop.toFixed(2)}%<br>` +
		`Top Locations: <br>${topString(topics_info_record["topLocations"][i])}`);
	}
	return fullinfo
    }

    function get_timeslot_data(topics_info_record) {
	// gets data for a single timeslot
	var bubblesizes = [];
	var ids = [];
	for (var i=0; i < NTOPICS; i++) {
	    bubblesizes.push(topics_info_record["proportions"][i] * 100 * 10);
	    ids.push(i);
	}

	var fullinfo = get_hover_text(topics_info_record);
	var colors = Array(NTOPICS).fill("#1f77b4");
	return {
	    "ids": ids,
	    "fullinfo": fullinfo,
	    "bubblesizes": bubblesizes, 
	    "colors": colors}
    }

    var timeslots = Object.keys(topics_info["timeslots"]);
    // move "full" to back of array
    timeslots.push(timeslots.splice(timeslots.indexOf("full"), 1)[0]);


    var data = get_timeslot_data(topics_info["timeslots"]["1470"]);
    var coordinates = get_xy(topics_info["coordinates"]);

    // main trace (full corpus)
    var trace = {
	x: coordinates["x"],
	y: coordinates["y"],
	text: data["ids"],
	hovertemplate: data["fullinfo"][category],
	customdata: [data["fullinfo"]['1470']],
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

    // frames
    var frames = [];
    for (const timeslot in topics_info["timeslots"]) {
	var ts_data = get_timeslot_data(topics_info["timeslots"][timeslot]);

	frames.push({
	    name: timeslot,
	    data: [{
		hovertemplate: ts_data["fullinfo"][category], 
		customdata: [ts_data["fullinfo"], timeslot],
		marker: {size: ts_data["bubblesizes"]}
	    }]
	})
	// cache the sizes
	// cached_sizes = {
	// full: [ ]
	// 
	cached_sizes[timeslot] = ts_data["bubblesizes"];
    }


    //slider
    var sliderSteps = [];
    for (var i = 0; i < timeslots.length; i++){
	var timeslot = timeslots[i];
	sliderSteps.push({
	    method: 'animate',
	    label: timeslot,
	    args: [[timeslot], {
		mode: 'immediate',
		transition: {duration: 300},
		frame: {duration: 300, redraw: false},
	    }]
	});
    }

    ldaPcaLayout.updatemenus = [{
	x: 0,
	y: 0,
	yanchor: 'top',
	xanchor: 'left',
	showactive: false,
	direction: 'left',
	type: 'buttons',
	pad: {t: 87, r: 10},
	buttons: [{
	    method: 'animate',
	    args: [null, {
		mode: 'immediate',
		fromcurrent: true,
		transition: {duration: 300},
		frame: {duration: 500, redraw: false}
	    }],
	    label: 'Play'
	}, {
	    method: 'animate',
	    args: [[null], {
		mode: 'immediate',
		transition: {duration: 0},
		frame: {duration: 0, redraw: false}
	    }],
	    label: 'Pause'
	},
	]
    }, 
    ];

    ldaPcaLayout.sliders =[{
	pad: {l: 130, t: 55},
	currentvalue: {
	    visible: true,
	    prefix: 'Decade:',
	    xanchor: 'right',
	    font: {size: 20, color: '#666'}
	},
	steps: sliderSteps
    }]

    if (annotations == false)
	ldaPcaLayout.annotations = null;

    Plotly.newPlot(LDA_PCA_PLOT_NAME, {
	data: [trace],
	layout: ldaPcaLayout,
	frames: frames,
    },
	{displayModeBar: false});

    updateColors(topicNum);
    document.getElementById("selectedTopic").innerHTML = topicNum;

    // when a topic is selected update colors and plot topic terms 
    var ldaPcaPlot = document.getElementById(LDA_PCA_PLOT_NAME);
    ldaPcaPlot.on('plotly_click', function(data) {
	var pn = data.points[data.points.length - 1].pointNumber;
	topicnum = pn;
	updateColors(pn);

	$.getJSON('./php/get_top_topic_relevance_terms.php?topicId=' + pn.toString(),
	    function(data) {
		plotTopicTerms(pn,data["topterms"]); // pass topic id 
	    });

	//$.getJSON('./php/get_topic_proportions.php?topicId=' + pn.toString(), 
	//    function(data) {
	//	plot_topic_proportion(data);
	//   });
    });

    topicsdata = topics_info;
}
