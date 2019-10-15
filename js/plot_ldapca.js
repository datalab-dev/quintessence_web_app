function plot_ldapca(data) { 
    // needs proportions
    // x and y of each topic

    console.log("plotting ldapca plot");
    // given the array of document objects File_ID Score
    // sort object based on scores
    // keep only the top NDOCS
    var ldapca = document.getElementById("ldapca");
    ldapca.innerHTML = "";

    console.log(data);
    var plot_data = {
	  x: data['x'],
	  y: data['y'],
	  text: data['topics'],
	  textposition: 'bottom',
	  mode: 'markers+text',
	  type: 'scatter'
    };

    var layout = {
	title: 'LDA PCA',
	autosize: "false",
	height: 900,
	width: 1000,
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

}

