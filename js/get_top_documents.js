NDOCS = 5;

function get_top_documents() {
    // get the topic id
    // pass to get_top_documents.php 
    // parse the response

    var topicid = document.getElementById("topicid").value;

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", "./php/get_top_documents.php", true);
    xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlHttp.send("topicid=" + topicid)

    xmlHttp.onreadystatechange = function ()  {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
	   parse_top_documents(JSON.parse(xmlHttp.responseText));

        }// if success
    }//response recieved
}//get_top_documents

function parse_top_documents(data) {
   // given the array of document objects File_ID Score
   // sort object based on scores
   // keep only the top NDOCS
   document.getElementById("top_docs").innerHTML = "";
   data.sort(function(a,b) {
       return ((a.Score > b.Score) ? -1 : ((a.Score == b.Score) ? 0 : 1));
   });

   // for each document
   for (var i =0; i < NDOCS; i++) {

       var container = document.createElement('div');
       container.className = "doc_container";
       container.id = data[i].File_ID;

       var info = document.createElement('div');
       info.className = "info";
       info.id = "info_" + data[i].File_ID;
       //var infobutton = document.createElement('button');
       //infobutton.id = data[i].File_ID;
       //infobutton.innerHTML = "get info";
       //infobutton.onclick = function(){get_meta(this.id)};
       get_meta(data[i].File_ID);

       var doc = document.createElement('div');
       doc.className = "doc";
       doc.id = "doc_" + data[i].File_ID; 
       var docbutton = document.createElement('button');
       docbutton.id = data[i].File_ID;
       docbutton.innerHTML = "get text";
       docbutton.onclick = function(){get_document(this.id)};

       //info.appendChild(infobutton);
       doc.appendChild(docbutton);

       container.appendChild(info);
       container.appendChild(doc);

       document.getElementById('top_docs').appendChild(document.createElement("hr"));
       document.getElementById('top_docs').appendChild(container);
   }
}
