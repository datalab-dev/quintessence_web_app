function buttonGetFullDocument(qid) {
    $.getJSON(`./php/get_meta.php?qid=${qid}`, function(data) {
        window.open(`http://quintessence.ds.lib.ucdavis.edu/xml/${data['File_ID']}.headed.xml`)
    });
}

function getFullDocument(data, docid) {
    var url = `./php/get_document.php?qid=${qid}&type=lemma&truncated=false`;
    $.getJSON(url, function(data) {
        document.getElementById("document").innerHTML = data;
    });
}
