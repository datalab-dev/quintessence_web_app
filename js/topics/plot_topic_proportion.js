function plot_topic_proportion(proportions) {
    console.log(proportions);
    var data = [
	{
	    x: Object.keys(proportions),
	    y: Object.values(proportions),
	    type: 'bar'
	}
    ];

    Plotly.newPlot('topic_proportion', data);
}
