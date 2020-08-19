function getTruncatedDocument(qid) {
    var url = `./php/get_document.php?qid=${qid}&type=lemma&truncated=true`;
    $.getJSON(url, function(data) {
        parseDocument(data, qid);
    });
}

function parseDocument(data, qid) {
    var text = data.replace("\t", " ").substring(0,1000);
    $(`#sample_${qid}`).append(`
        <h2>Text Sample</h2>
        <p>${text}</p>
        <p style="font-size: x-large; text-align: center;">...</p>
    `);
}
