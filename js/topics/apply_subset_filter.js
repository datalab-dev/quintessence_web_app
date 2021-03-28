/*

Functions for updating the topic proportions of lda bubble plot.

Pulls the information from the subset controls drop downs, constructs
a query to get_subset_lda, replots the bubble plot (resizes the bubbles),
updates some elements on the page (e.g num results)

Calls to php:
get_subset_lda

*/

function getDropdownString(field) {
    var dropdown = $(`#selected-${field}`).dropdown('get value');
    str = '';
    if (dropdown)
        var str = `'${dropdown.join("','")}'`;

    return str;
}

function updateLdaPca() {
    var maxdocs = 5; // number of top docs to display

    /* params from dropdown and timeline */
    var slider = $("#date-range").data("ionRangeSlider");
    var dateString = `'${slider.result.from}','${slider.result.to}'`;
    var url = `./php/get_subset_lda.php?proportion=true&dates=${dateString}` +
              `&keywords=${getDropdownString('keywords')}` +
              `&authors=${getDropdownString('authors')}` +
              `&locations=${getDropdownString('locations')}`

    console.log(url);
    /* show as loading */
    document.getElementById("ndocs").innerHTML = "";
    document.getElementById("status").innerHTML = "Fetching Results ...";
    document.getElementById("overlay").style.display = "block";

    /* replot with new proportions */
    $.getJSON(url, function(data) {
	cached_sizes = data["proportions"];

	var proportions = []
	for (var i = 0; i < data["proportions"].length; i++) {
	    proportions[i] = data["proportions"][i] * 100 * 20;
	}
	var update = {
	    'marker.size': [proportions],
	}
	console.log(data["qids"]);
	console.log(data["proportions"]);
	console.log(proportions);
	Plotly.restyle(LDA_PCA_PLOT_NAME, update, 0);



        var ndocs = data["qids"].length;
        ndocs = ndocs < maxdocs ? ndocs : maxdocs;
        //initDocumentResults(data['qids'], ndocs);

        /* show as loaded */
        document.getElementById("ndocs").innerHTML = `${data["qids"].length} results`;
        document.getElementById("status").innerHTML = "Loaded";
        document.getElementById("overlay").style.display = "none";
    });
}
