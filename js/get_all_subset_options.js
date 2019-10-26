function get_all_subset_options() {

    topic_proportion = [];
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", "./php/get_all_subset_options.php", true);
    xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlHttp.send();

    xmlHttp.onreadystatechange = function ()  {
	if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
	    data = JSON.parse(xmlHttp.responseText);
	    create_subset_options(data);
	}// if success
    }//response recieved
}//get_topic_terms
