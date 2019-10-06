function get_meta(docid) {
    // get the topic id from input value
    // pass to get_topic_terms.php 
    // parse the response


    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", "./php/get_meta.php", true);
    xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlHttp.send("docid=" + docid); 

    xmlHttp.onreadystatechange = function ()  {
	if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
	    parse_meta(JSON.parse(xmlHttp.responseText), docid);

	}// if success
    }//response recieved
}//get_top_documents

function parse_meta(data, docid) {
    keep = ["File_ID", "STC_ID", "ESTC_ID", "EEBO_Citation", "Proquest_ID", "VID", "Title", "Location", "Publisher", "Author", "Keywords", "Date", "Language", "Doc_Size", "Year"];
    var container = document.getElementById("info_" + docid);
    container.innerHTML = "";
    var table = document.createElement("table");
    for(var i = 0; i <  Object.keys(data).length; i++) {
        var tr = table.insertRow(-1);
	var key = Object.keys(data)[i];
	if (keep.includes(key)) {
	tr.insertCell(0).innerHTML = key;
	tr.insertCell(1).innerHTML = data[key];
	}
    }
    container.appendChild(table);
}
