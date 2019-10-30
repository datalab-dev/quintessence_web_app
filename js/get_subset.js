function get_subset() {
    // get the topic id from input value
    // pass to get_topic_terms.php 
    // parse the response


    // TIMELINE
    var d1 = $('#slider-range').slider("values", 0);
    var d2 = $('#slider-range').slider("values", 1);
    ds = "'" + d1 + "','" + d2 + "'";

    // KEYWORDS
    var kws =$("#selected-keywords")[0].selectize.items;
    kws_string = "";
    if (kws.length > 0) {
        var kws_string = "'" + kws.join("','") + "'";
    }

    // AUTHORS
    var aus =$("#selected-authors")[0].selectize.items;
    aus_string = "";
    if (aus.length > 0) {
    var aus_string = "'" + aus.join("','") + "'";
    } 



    // LOCATIONS
    var ls =$("#selected-locations")[0].selectize.items;
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
             init_documents_results(data, 10);
	     document.getElementById("ndocs").innerHTML = data.length;
             //console.log(xmlHttp.responseText);
	    } 

	}// if success
    }//response recieved
}//get_subset

