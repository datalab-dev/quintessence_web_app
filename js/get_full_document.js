function button_get_full_document (id) {
    docid = id.split("_")[1];
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", "./php/get_document_File_ID.php", true);
    xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlHttp.send("docid=" + docid); 

    xmlHttp.onreadystatechange = function ()  {
	if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
	    console.log(xmlHttp.responseText);
	    var name = xmlHttp.responseText;
            name = name + ".headed.xml"; 
            //window.location.href = "/xml/" + name;
            window.open("/xml/" + name);
	}// if success
    }//response recieved
}

function get_full_document() {
    docid = 1;
    type = "Lemma";
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", "./php/get_full_document.php", true);
    xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlHttp.send("docid=" + docid + "&type=" + type)

    xmlHttp.onreadystatechange = function ()  {
	if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
	    console.log("get_full_document", docid, type);
	    console.log(xmlHttp.responseText);
	    //data = xmlHttp.responseText.replace('"', " ");
	    //data = data.replace("\\t",'');
	    document.getElementById("document").innerHTML = xmlHttp.responseText;
	}// if success
    }//response recieved
}
