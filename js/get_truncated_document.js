function button_get_truncated_document (id) {
    type = id.split("_")[1];
    docid = id.split("_")[2];
    document.getElementById("button_" + "Raw_" + docid).classList.remove("selected");
    document.getElementById("button_" + "Standardized_" + docid).classList.remove("selected");
    document.getElementById("button_" + "Lemma_" + docid).classList.remove("selected");
    document.getElementById(id).classList.add("selected");
    get_truncated_document(docid, type);
}

function get_truncated_document(docid, type) {
    // get the topic id from input value
    // pass to get_topic_terms.php 
    // parse the response

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", "./php/get_truncated_document.php", true);
    xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlHttp.send("docid=" + docid + "&type=" + type)

    xmlHttp.onreadystatechange = function ()  {
	if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
	    console.log("get_truncated_document", docid, type);
	    parse_document(JSON.parse(xmlHttp.responseText), docid);

	}// if success
    }//response recieved
}//get_document

function parse_document(data, docid) {
    // given the array of document objects QID Score
    // sort object based on scores
    // keep only the top NDOCS
    container = document.getElementById("text_" + docid);
    text = data.replace("\t", " ").substring(0,5000);
    content = document.createElement("p");
    container.innerHTML = "";
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
