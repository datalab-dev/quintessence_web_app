function update_ldapca(data) {
    var qids = "";
    for (var i = 0; i < data.length; i++)
    {
	qids = qids + "'" + data[i] + "',";
    }
    qids = qids.substring(0, qids.length - 1);

    var params = "qids=" + qids;


    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", "./php/get_proportions.php", true);
    xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlHttp.send(params); 
    console.log("sent request");

    xmlHttp.onreadystatechange = function ()  {
	if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
	    if (xmlHttp.responseText) {
		console.log("recieved request");
	     data = JSON.parse(xmlHttp.responseText);
	     console.log(data);
             //update_plot(data);
	    }
	}// if success
    }//response recieved
}//get_subset

function update_plot(data) {

    // compute topic proportions for each topic
    // doc_len * doc_topics / colsums(doc_len * doc_topics)
    var doc_lens = data["doc_lens"];
    var doc_topics = data["doc_topics"];
    var scaled = new Array([]);
    for (var i = 0; i < doc_topics.length; i++){
	for (var j = 0; j < doc_topics[i].length; j++){
	    scaled[i][j] = doc_lens[i] * doc_topics[i][j];
	}
    }

    // get colsums
    var cs = [];
    var total = 0;
    for (var i = 0; i < scaled.length; i++){
	for (var j = 0; j < scaled[i].length; j++) {
	    cs[j] = cs[j] + scaled[i][j];
	    total = total + scaled[i][j];
	}
    }

    // normalize colsums
    var tp = [];
    for (var i = 0; i < cs.length; i++){
	tp[i] = cs[i] / total;
    }
    console.log(tp);

    // update the marker sizes of the plot to reflect the new proportions

}

