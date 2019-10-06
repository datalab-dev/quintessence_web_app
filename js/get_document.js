TYPE = "Standardized"; //XML, Raw, Lemma, Standardized, PartOfSpeech
function get_document(docid) {
    // get the topic id from input value
    // pass to get_topic_terms.php 
    // parse the response


    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", "./php/get_document.php", true);
    xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlHttp.send("docid=" + docid + "&type=" + TYPE)

    xmlHttp.onreadystatechange = function ()  {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
	   parse_document(JSON.parse(xmlHttp.responseText), docid);

        }// if success
    }//response recieved
}//get_top_documents

function parse_document(data, docid) {
   // given the array of document objects File_ID Score
   // sort object based on scores
   // keep only the top NDOCS
   container = document.getElementById("doc_" + docid);
   text = data.replace("\t", " ").substring(0,5000);
   container.innerHTML = text

   if (text.length <= 5000) {
       var elipsis = document.createElement("p");
       elipsis.innerHTML = "...";
       elipsis.style.fontSize = "xx-large";
       elipsis.style.textAlign = "center";
       document.getElementById(docid).appendChild(elipsis);
   }

   var getmore = document.createElement("button");
   getmore.innerHTML = "open entire document";
   document.getElementById(docid).appendChild(getmore);
}
