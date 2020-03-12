function update_ldapca(data) {
   console.log("REDRAWING PLOT");

    var graphDiv = document.getElementById("ldapca");
    var tp = data["proportions"];

    sizes = [];
    texts = [];
    for (var i = 0; i < tp.length; i++)
    {
	s = tp[i] * 100 * 10;
	sizes.push(s)
	text = "Topic ID: " + String(i+1) + "<br> Proportion: " + String((tp[i] *100).toFixed(2)) + "%";
	texts.push(text);
    }

    x = JSON.parse(document.getElementById("xinfo").innerHTML);
    y = JSON.parse(document.getElementById("yinfo").innerHTML);

    var plot_data = {
	x: x,
	y: y,
	text: texts,
	hovertemplate: '%{text} ',
	textposition: 'bottom',
	mode: 'markers',
	type: 'scatter',
	marker: {
	    size: sizes,
	    color: "#1f77b4",
	    line: {
		color: 'black',
		width: 2
	    }
	}
    };

    var layout = {
	autosize: "false",
	hovermode: "closest",
	hoverdistance: 20,
	plot_bgcolor: 'rgb(243,243,243)',
	scrollZoom: "false",
	yaxis: {
	    fixedrange: true,
	    showgrid: false,
	},
	xaxis : {
	    fixedrange: true,
	    showgrid: false,
	    ticks: '',
	    showticklabels: false
	},
	height: 900,
	margin: {
	    l: 0,
	    r: 0,
	    b: 50,
	    t: 50,
	    pad: 0
	}
    }

    var data = [plot_data];
    
    document.getElementById("sinfo").innerHTML = "";
    document.getElementById("sinfo").innerHTML = JSON.stringify(sizes) ;
    Plotly.newPlot('ldapca', data, layout, {displayModeBar: false});

    ldapca.on('plotly_click', function(data){
	colors = JSON.parse(document.getElementById("cinfo").innerHTML);
	sizes = JSON.parse(document.getElementById("sinfo").innerHTML);
	gd = document.getElementById("ldapca");
	var id = 0;

	for(var i=0; i < data.points.length; i++){
	    text = data.points[i].text;
	    text = text.split("<br")[0];
	    id = text.split(":")[1].trim();
	}

	document.getElementById("topic_terms").setAttribute("name", id);
	get_topic_terms();
	if (document.getElementById("lda_area").getAttribute("name") != "no_top_docs") {
	    get_topic_documents();
	}

	// get colors and sizes from data
	var pn = '', tn = '';
	for (var i =0; i < data.points.length; i++) {
	    pn = data.points[i].pointNumber;
	    tn = data.points[i].curveNumber;
	};
	colors[pn] = '#a91111';
	console.log("pn: "+ pn);
	var update = {'marker':{color: colors, size:sizes, line: { color: 'black', width: 2}}};
	Plotly.restyle('ldapca', update, [tn]);
    });
}
