function getTruncatedDocument(qid) {
    var url = `./php/get_document.php?qid=${qid}&type=lemma&truncated=true`;
    $.getJSON(url, function(data) {
        parseDocument(data, qid);
    });
}

function parseDocument(data, docid) {
    var container = document.getElementById("sample_" + docid);
    var header = document.createElement("h2");
    header.innerHTML = "Text Sample";
    container.appendChild(header);

    var text = data.replace("\t", " ").substring(0,1000);
    var content = document.createElement("p");
    content.innerHTML = text
    container.appendChild(content);

    if (text.length <= 5000) {
    	var elipsis = document.createElement("p");
    	elipsis.innerHTML = "...";
    	elipsis.style.fontSize = "x-large";
    	elipsis.style.textAlign = "center";
    	container.appendChild(elipsis);
    }
}
