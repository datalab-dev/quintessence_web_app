const range = (start, stop, step = 1) =>
      Array(Math.ceil((stop - start) / step)).fill(start).map((x, y) => x + y * step)

var topic_proportion_layout = {
    title: ' ',
    autosize: false,
    xaxis: {
        title: 'Year',
        gridcolor: 'rgb(243, 243, 243)',
        type: 'bar',
        range: [1470, 1700],
        dtick: 10,
        zerolinewidth: 1,
        ticklen: 1,
        gridwidth: 1
    },
    yaxis: {
        title: 'Proportion',
        gridcolor: 'rgb(243, 243, 243)',
        gridwidth: 1,
        showticklabels: true,
	tickformat: '.2%',
        ticklen: 1,
        showline: true
    },
    paper_bgcolor: 'rgb(243, 243, 243)',
    plot_bgcolor: 'rgb(243, 243, 243)',
    showlegend: false,
    hovermode: 'closest',
    width: 1024,
    height: 600
};
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

    Plotly.newPlot('topic_proportion', data, topic_proportion_layout);
}
