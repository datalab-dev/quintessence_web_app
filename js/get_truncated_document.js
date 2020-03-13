function get_truncated_document(docid) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", "./php/get_truncated_document.php", true);
    xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlHttp.send("docid=" + docid + "&type=lemma");

    xmlHttp.onreadystatechange = function ()  {
	if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
	    console.log("get_truncated_document", docid);
	    parse_document(JSON.parse(xmlHttp.responseText), docid);

	}// if success
    }//response recieved
}//get_document

function parse_document(data, docid) {
    // given the array of document objects QID Score
    // sort object based on scores
    // keep only the top NDOCS
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
