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

    /* show as loading */
    document.getElementById("ndocs").innerHTML = "";
    document.getElementById("status").innerHTML = "Fetching Results ...";
    document.getElementById("overlay").style.display = "block";

    /* replot with new proportions */
    $.getJSON(url, function(data) {
        var topics = JSON.parse(document.getElementById("topics").innerHTML);
        for (var i = 0; i < topics.length; i++) {
            topics[i]['proportion'] = data['proportions'][i];
        }
        document.getElementById("topics").innerHTML = JSON.stringify(topics);
        plotLdaPca(topics);

        var ndocs = data["qids"].length;
        ndocs = ndocs < maxdocs ? ndocs : maxdocs;
        initDocumentResults(data['qids'], ndocs);

        /* show as loaded */
        document.getElementById("ndocs").innerHTML = `${data["qids"].length} results`;
        document.getElementById("status").innerHTML = "Loaded";
        document.getElementById("overlay").style.display = "none";
    });
}
