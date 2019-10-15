function get_topic_proportion() {

    topic_proportion = [];
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", "./php/get_topic_proportion.php", true);
    xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlHttp.send();

    xmlHttp.onreadystatechange = function ()  {
	if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
	    topic_proportion = JSON.parse(xmlHttp.responseText);
	}// if success
    }//response recieved
    return topic_proportion;
}//get_topic_terms
