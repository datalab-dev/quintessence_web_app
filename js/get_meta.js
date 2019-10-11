function button_get_meta(id) {
    id = id.split("_")[2];
    get_meta(id);
}

function get_meta(docid) {
    // get the topic id from input value
    // pass to get_topic_terms.php 
    // parse the response


    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", "./php/get_meta.php", true);
    xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlHttp.send("docid=" + docid); 
    console.log("get meta: ", docid);

    xmlHttp.onreadystatechange = function ()  {
	if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
	    parse_meta(JSON.parse(xmlHttp.responseText), docid);

	}// if success
    }//response recieved
}//get_meta

function parse_meta(data, docid) {
    var ids = ["File_ID", "STC_ID", "ESTC_ID", "EEBO_Citation", "Proquest_ID", "VID"];
    var main = ["Title", "Location", "Publisher", "Date", "Word_Count",];
    var container = document.getElementById("info_" + docid);
    container.innerHTML = "";

    var id_table = document.createElement("table");
    var row = id_table.insertRow(0);
    for (var i = 0; i < ids.length; i++) {
	var cell = row.insertCell(-1).innerHTML = "<b>" + ids[i] + "</b>";
    }
    
    var tr = id_table.insertRow(1);
    for(var i = 0; i <  Object.keys(data).length; i++) {
	var key = Object.keys(data)[i];
	if (ids.includes(key)) {
	    tr.insertCell(-1).innerHTML = data[key];
	}
    }

    var main_table = document.createElement("table");
    for (var i = 0; i < Object.keys(data).length; i++) {
	var key = Object.keys(data)[i];
	if (main.includes(key)) {
            var row = main_table.insertRow(-1);
	    row.insertCell(-1).innerHTML = "<b>" + key + " </b>";
	    row.insertCell(-1).innerHTML = data[key];
	}
    }

    container.appendChild(main_table);
    container.appendChild(id_table);
}
