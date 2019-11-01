function button_get_full_document (id) {
    window.location.href = "/xml/A01584.headed.xml";
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

function get_xml_document() {
    //var html = '<html><head></head><body>Foo</body></html>';
    var iframe = document.createElement('iframe');
    //iframe.src = 'data:text/html;charset=utf-8,' + encodeURI(html);
    iframe.src = "/xml/A01584.headed.xml";
    document.getElementById("document").appendChild(iframe);
}

    

