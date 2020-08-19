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
    document.getElementById("status").innerHTML = "Fetching Results ...";

    /* replot with new proportions */
    $.getJSON('./php/get_subset_lda.php', function(data) {
        var topics = JSON.parse(document.getElementById("topics").innerHTML);
        for (var i = 0; i < topics.length; i++) {
            topics[i]['proportion'] = data['proportions'][i];
        }
        plotLdaPca(topics);

        var ndocs = data["qids"].length;
        ndocs = ndocs < maxdocs ? ndocs : maxdocs;
        initDocumentResults(data['qids'], ndocs);
    });
}
