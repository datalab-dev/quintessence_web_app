function buttonGetFullDocument(qid) {
    $.getJSON(`./php/get_meta.php?qid=${qid}`, function(data) {
        window.open(`/xml/${data['fileId']}.headed.xml`)
    });
}

function getFullDocument(data, docid) {
    var url = `./php/get_document.php?qid=${qid}&type=lemma&truncated=false`;
    $.getJSON(url, function(data) {
        document.getElementById("document").innerHTML = data;
    });
}
