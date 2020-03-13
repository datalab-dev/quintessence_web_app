function get_subset() {
    // get the topic id from input value
    // pass to get_topic_terms.php 
    // parse the response


    // TIMELINE
    var slider = $("#date-range").data("ionRangeSlider");

    // Get values
    var d1 = slider.result.from;
    var d2 = slider.result.to;

    ds = "'" + d1 + "','" + d2 + "'";

    // KEYWORDS
    var kws = $('#selected-keywords').dropdown('get value');
    kws_string = "";
    if (kws) {
        var kws_string = "'" + kws.join("','") + "'";
    }

    // AUTHORS
    var aus = $('#selected-authors').dropdown('get value');
    aus_string = "";
    if (aus) {
    var aus_string = "'" + aus.join("','") + "'";
    } 

    // LOCATIONS
    var ls = $('#selected-locations').dropdown('get value');
    ls_string = "";
    if (ls) {
    var ls_string = "'" + ls.join("','") + "'";
    }

    var params = "proportion=" + "True" + "&dates=" + ds + "&keywords=" + kws_string + "&authors=" + aus_string + "&locations=" + ls_string;

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", "./php/get_subset.php", true);
    xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlHttp.send(params); 
    console.log("get subset: ", params);
    document.getElementById("ndocs").innerHTML = "";
    document.getElementById("status").innerHTML = "Fetching Results ...";


    document.getElementById("overlay").style.display = "block";

    xmlHttp.onreadystatechange = function ()  {
	if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
	    if (xmlHttp.responseText) {
		console.log("updating plot");
		console.log("big success");
	     data = JSON.parse(xmlHttp.responseText);
    	     update_ldapca(data);
             init_documents_results(data["qids"], 5);
	     document.getElementById("ndocs").innerHTML = data["qids"].length + " results";
             document.getElementById("status").innerHTML = "Loaded";
             document.getElementById("overlay").style.display = "none";
	    } 

	}// if success
    }//response recieved
}//get_subset

