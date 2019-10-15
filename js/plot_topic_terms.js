function plot_topic_terms(data, topicid) {
    console.log("plotting topic terms" + topicid);
    // given the array of document objects File_ID Score
    // sort object based on scores
    // keep only the top NDOCS
    var topic_terms = document.getElementById("topic_terms");
    topic_terms.innerHTML = "";

    var plot = document.createElement("div");
    plot.id = "topic_terms_plot";
    topic_terms.appendChild(plot);
    data.sort(function(a,b) {
	return ((a.Score > b.Score) ? -1 : ((a.Score == b.Score) ? 0 : 1));
    });

    data = data.slice(0,NTERMS);

    var terms = [];
    var scores = [];
    for (var i = 0; i < data.length; i++)
    {
	terms.push(data[i]["Term"]);
	scores.push(data[i]["Score"]);
    }


    var plot_data = [
	{
	    x: scores,
	    y: terms,
	    type: 'bar',
	    orientation: 'h'
	}
    ];
    var layout = {
	title: 'Topic Terms ' + topicid,
	staticPlot: true,
	autosize: false,
	height: 900,
	width: 300,
	yaxis: {autorange:"reversed"},
	margin: {
	    l: 50,
	    r: 0,
	    b: 50,
	    t: 50,
	    pad: 0
	},
    };

    Plotly.newPlot('topic_terms_plot', plot_data, layout, {staticPlot: true});
}
