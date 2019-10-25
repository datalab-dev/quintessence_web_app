function get_checked(name) {
    var boxes = document.getElementsByName(name);
    var checked = [];

    for (var i = 0; i < boxes.length; i++) {
	if (boxes[i].checked) { 
	    checked.push(boxes[i].value); 
	}
    }
    return checked;
}

function get_subset() {
    // get the topic id from input value
    // pass to get_topic_terms.php 
    // parse the response


    // TIMELINE
    var d1 = $('#slider-range').slider("values", 0);
    var d2 = $('#slider-range').slider("values", 1);
    ds = "'" + d1 + "','" + d2 + "'";

    // KEYWORDS
    var kws = get_checked("keywords_checkbox");
    kws_string = "";
    if (kws.length > 0) {
        var kws_string = "'" + kws.join("','") + "'";
    }

    // AUTHORS
    var aus = get_checked("authors_checkbox");
    aus_string = "";
    if (aus.length > 0) {
    var aus_string = "'" + aus.join("','") + "'";
    } 



    // LOCATIONS
    var ls = get_checked("locations_checkbox");
    ls_string = "";
    if (ls.length > 0) {
    var ls_string = "'" + ls.join("','") + "'";
    }

    var params = "dates=" + ds + "&keywords=" + kws_string + "&authors=" + aus_string + "&locations=" + ls_string;


    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", "./php/get_subset.php", true);
    xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlHttp.send(params); 
    console.log("get subset: ", params);

    xmlHttp.onreadystatechange = function ()  {
	if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
	    if (xmlHttp.responseText) {
	     data = JSON.parse(xmlHttp.responseText);
             console.log(data);
             init_documents_results(data, 10);
             //console.log(xmlHttp.responseText);
	    } 

	}// if success
    }//response recieved
}//get_subset

