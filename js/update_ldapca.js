function update_ldapca(data) {
   console.log("REDRAWING PLOT");
    var graphDiv = document.getElementById("ldapca");
    var tp = data["proportions"];

    sizes = [];
    for (var i = 0; i < tp.length; i++)
    {
	s = tp[i] * 100 * 10;
	sizes.push(s)
    }

    var update = {
	marker: {
	    size: sizes,
	    line: {
		color: 'black',
		width: 2
	    }
	}
    }
    
    Plotly.restyle(graphDiv, update, 0);

}

