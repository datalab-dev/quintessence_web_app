NTERMS = 30;

function get_topic_terms() {
    // get the topic id from input value
    // pass to get_topic_terms.php 
    // parse the response

    var topicid = document.getElementById("topicid").value;

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", "./php/get_topic_terms.php", true);
    xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlHttp.send("topicid=" + topicid)

    xmlHttp.onreadystatechange = function ()  {
	if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
	    plot_topic_terms(JSON.parse(xmlHttp.responseText), topicid);
	}// if success
    }//response recieved
}//get_topic_terms
