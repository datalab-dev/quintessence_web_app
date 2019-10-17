NDOCS = 5;

function get_topic_documents() {
    // get the topic id
    // pass to get_topic_documents.php 
    // parse the response


    topicid = document.getElementById("topic_terms").getAttribute('name');
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", "./php/get_topic_documents.php", true);
    xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlHttp.send("topicid=" + topicid)

    xmlHttp.onreadystatechange = function ()  {
	if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
	    parse_topic_documents(JSON.parse(xmlHttp.responseText));

	}// if success
    }//response recieved
}//get_topic_documents

function parse_topic_documents(data) {
    // given the array of document objects QID Score
    // sort object based on scores
    // keep only the top NDOCS
    document.getElementById("top_docs").innerHTML = "";
    data.sort(function(a,b) {
	return ((a.Score > b.Score) ? -1 : ((a.Score == b.Score) ? 0 : 1));
    });

    var ids = [];
    for (var i = 0; i < 50; i++)
    {
	ids[i] = data[i].QID;
    }

    init_documents_results(ids, NDOCS);
}
