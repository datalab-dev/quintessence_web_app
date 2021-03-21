function plot_topic_proportion(proportions) {
    // filter out points past 1700 and before 1470

    const allowed = range(1470,1700);
    const filtered = Object.keys(proportions)
      .filter(key => allowed.includes(parseInt(key)))
      .reduce((obj, key) => {
	      obj[key] = proportions[key];
	      return obj;
	    }, {});
    var data = [
	{
	    x: Object.keys(filtered),
	    y: Object.values(filtered),
	    type: 'bar'
	}
    ];

    Plotly.newPlot(TOPIC_PROPORTIONS_PLOT_NAME, data, topic_proportion_layout);
}
