function init_subset_defaults() {
    // keywords
    keywords = document.getElementById("keywords_options");
    for (var i = 0; i < 20; i++) {
	var kw = Keywords[i];
	var input = document.createElement("input");
	input.setAttribute("name", "keywords_checkbox");
	input.setAttribute("type", "checkbox");
	input.setAttribute("value", kw);
	var label = document.createElement("Label");
	label.setAttribute("for", kw);
	label.innerHTML = kw;
	keywords.appendChild(input);
	keywords.appendChild(label);
    }

    //authors
    authors = document.getElementById("authors_options");
    for (var i = 0; i < 20; i++) {
	var au = Authors[i];
	var input = document.createElement("input");
	input.setAttribute("name", "authors_checkbox");
	input.setAttribute("type", "checkbox");
	input.setAttribute("value", au);
	var label = document.createElement("Label");
	label.setAttribute("for", au);
	label.innerHTML = au;
	authors.appendChild(input);
	authors.appendChild(label);
    }

    //locations
    locations = document.getElementById("locations_options");
    for (var i = 0; i < 20; i++) {
	var lc = Locations[i];
	var input = document.createElement("input");
	input.setAttribute("name", "locations_checkbox");
	input.setAttribute("type", "checkbox");
	input.setAttribute("value", lc);
	var label = document.createElement("Label");
	label.setAttribute("for", lc);
	label.innerHTML = lc;
	locations.appendChild(input);
	locations.appendChild(label);
    }
}
