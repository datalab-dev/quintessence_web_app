NTERMS = 30;

function get_topic_terms() {
    // get the topic id from input value
    // pass to get_topic_terms.php 
    // parse the response

    var topicid = document.getElementById("topicid").value;

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", "./php/get_topic_terms.php", true);
    xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlHttp.send("topicid=" + topicid)

    xmlHttp.onreadystatechange = function ()  {
	if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
	    parse_topic_terms(JSON.parse(xmlHttp.responseText), topicid);
	}// if success
    }//response recieved
}//get_topic_terms

function parse_topic_terms(data, topicid) {
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
	autosize: "false",
	height: 800,
	width: 900,
	yaxis: {autorange:"reversed"},
	margin: {
	    l: 50,
	    r: 50,
	    b: 50,
	    t: 50,
	    pad: 4
	},
    };

    Plotly.newPlot('topic_terms_plot', plot_data, layout, {staticPlot: true});
}
