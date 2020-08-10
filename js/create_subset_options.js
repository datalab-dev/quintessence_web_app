function create_subset_options(data) {
    //modified to use semantic ui selector not selectize!

    // keywords
    var kw = document.getElementById('selected-keywords')
    for (var i = 0; i < data["keywords"].length; i++) {
    	var val = data["keywords"][i];
    	var option = document.createElement("option");
    	option.text = val;
    	option.value = val;
    	kw.appendChild(option);
    }

    // authors
    var a = document.getElementById('selected-authors')
    for (var i = 0; i < data["authors"].length; i++) {
    	var val = data["authors"][i];
    	var option = document.createElement("option");
    	option.text = val;
    	option.value = val;
    	a.appendChild(option);
    }

    // locations
    var l = document.getElementById('selected-locations')
    for (var i = 0; i < data["locations"].length; i++) {
    	var val = data["locations"][i];
    	var option = document.createElement("option");
    	option.text = val;
    	option.value = val;
    	l.appendChild(option);
    }
}
