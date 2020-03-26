function init_plot_ldapca() {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", "./php/init_ldapca.php", true);
    xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlHttp.send();

    xmlHttp.onreadystatechange = function ()  {
	if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
	    data = JSON.parse(xmlHttp.responseText);
	    console.log(data);
	    plot_ldapca(data['tp'], data['pca']);
	}// if success
    }//response recieved
}

/* var layout = {
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
    }; */


function plot_ldapca(tp, pca) {
    // needs proportions
    // x and y of each topic

    console.log("plotting ldapca plot");
    // given the array of document objects File_ID Score
    // sort object based on scores
    // keep only the top NDOCS
    var ldapca = document.getElementById("ldapca");
    ldapca.innerHTML = "";

    sizes = [];
    texts = [];
    for (var i = 0; i < tp['proportion'].length; i++) {
    	s = tp['proportion'][i] * 10;
    	sizes.push(s)
    	text = "Topic ID: " + String(i+1) + "<br> Proportion: " + String(tp['proportion'][i].toFixed(2)) + "%";
    	texts.push(text);
    }

    console.log(tp['proportion']);
    console.log(pca['x']);
    var plot_data = {
	x: pca['x'],
	y: pca['y'],
	text: texts,
	hovertemplate: '%{text} ',
	hoverlabel: {namelength: -1},
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
        },
    annotations: [
    {
      x: 0.0372,
      y: 0.1918,
      xref: 'Decades',
      yref: 'Word Change',
      text: 'each bubble represents <br> one topic',
      showarrow: true,
      arrowhead: 0,
      ax: -41,
      ay: -40
    },
    {
      x: -0.003,
      y: -0.1067,
      xref: 'Decades',
      yref: 'Word Change',
      text: 'color indicates <br> topic cluster',
      showarrow: true,
      arrowhead: 0,
      ax: -70,
      ay: 0
    },
    {
      x: -0.2138,
      y: 0.0802,
      xref: 'Decades',
      yref: 'Word Change',
      text: 'sizes reflect topic prevalence <br> in chosen subset',
      showarrow: true,
      arrowhead: 0,
      ax: 20,
      ay: -140
    },
    {
      x: -0.1505,
      y: 0.1335,
      xref: 'Decades',
      yref: 'Word Change',
      text: '',
      showarrow: true,
      arrowhead: 0,
      ax: -50,
      ay: -48
    },
    {
      x: 0.1229,
      y: 0.0558,
      xref: 'Decades',
      yref: 'Word Change',
      text: 'click bubble to view <br> terms in topic',
      showarrow: true,
      arrowhead: 0,
      ax: -50,
      ay: -75
    }
    ]
};

    var data = [plot_data];

    colors = [];
    for (var i = 0; i < sizes.length; i++) {
	colors.push("#1f77b4");
    }
    document.getElementById("sinfo").innerHTML = JSON.stringify(sizes) ;
    document.getElementById("cinfo").innerHTML = JSON.stringify(colors);
    document.getElementById("xinfo").innerHTML = JSON.stringify(pca['x']);
    document.getElementById("yinfo").innerHTML = JSON.stringify(pca['y']);

    Plotly.newPlot('ldapca', data, layout, {displayModeBar: false});

    colors[10] = '#a91111';
    var update = {'marker':{color: colors, size:sizes, line: { color: 'black', width: 2}}};
    Plotly.restyle('ldapca', update, 0);

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
