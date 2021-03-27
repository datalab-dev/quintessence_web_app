function plot_topic_proportion(proportions, proportions_plot_name) {
    // filter out points past 1700 and before 1470


    var decades = Object.keys(proportions);
    var props = [];
    for (var i =0 ; i < decades.length; i++) {
	var decade = decades[i]; 
	props[i] = proportions[decade][0];
    }

    var data = [
	{
	    x: decades,
	    y: props,
	    type: 'bar'
	}
    ];

    Plotly.newPlot(proportions_plot_name, data, topic_proportion_layout);
}
