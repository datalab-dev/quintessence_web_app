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
    for (var i = 0; i < tp['proportion'].length; i++)
    {
	s = tp['proportion'][i] * 10;
	sizes.push(s)
	texts.push( String(pca['topics'][i].substr(1)));
    }

    console.log(tp['proportion']);
    console.log(pca['x']);
    var plot_data = {
	x: pca['x'],
	y: pca['y'],
	text: texts,
	hovertemplate: 'Proportion: %{marker.size:.2f}' +
	'<br>Topic: %{text}',
	textposition: 'bottom',
	mode: 'markers+text',
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

    colors = [];
    for (var i = 0; i < sizes.length; i++) {
	colors.push("#1f77b4");
    }
    document.getElementById("sinfo").innerHTML = JSON.stringify(sizes) ;
    document.getElementById("cinfo").innerHTML = JSON.stringify(colors);
    Plotly.newPlot('ldapca', data, layout, {displayModeBar: false});

    ldapca.on('plotly_click', function(data){
	colors = JSON.parse(document.getElementById("cinfo").innerHTML);
	sizes = JSON.parse(document.getElementById("sinfo").innerHTML);
	gd = document.getElementById("ldapca");
	var id = 0;

	for(var i=0; i < data.points.length; i++){
	    id = data.points[i].text
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
