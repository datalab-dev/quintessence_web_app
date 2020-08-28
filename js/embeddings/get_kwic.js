/* given document term get kwic window and display results */
function getKwic(term) {
    $.getJSON(`./php/get_kwic.php?term=${term}`, function(data) {
        parseKwic(data, term)
    })
    .done(function() {
        $('#kwic-msg').text('');
        $('#top_docs').toggle()
        $('#search-button').off('click');
    });
}

/* initialize document results with kwic windows */
function parseKwic(data, term) {
    var kwics = [];
    for (const qid in data) {
        var doc = data[qid];
        kwics.push(doc.window.replace(doc.term, `<b>${doc.term}</b>`));
    }

    initDocumentResults(Object.keys(data), kwics.length, kwics);
}
