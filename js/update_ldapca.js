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

}
