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
	s = tp['proportion'][i] * 20;
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
	    line: {
		color: 'black',
		width: 2
	    }
	}
    };

    var layout = {
	title: 'LDA PCA',
	autosize: "false",
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

    Plotly.newPlot('ldapca', data, layout);
    ldapca.on('plotly_click', function(data){
	var id = 0;
	for(var i=0; i < data.points.length; i++){
	    id= data.points[i].text 
	}

	document.getElementById("topic_terms").setAttribute("name", id);
	get_topic_terms();
	get_topic_documents();
    });

}

