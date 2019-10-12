function init_documents_results(doc_ids_list, NDOCS) {
    console.log("init documents results", doc_ids_list, NDOCS);

    // for each document
    for (var i =0; i < NDOCS; i++) {

	qid = doc_ids_list[i];
	var container = document.createElement('div');
	container.className = "doc_container";
	container.id = qid;
	container.innerHTML = "<h3> " + qid + "</h3>";

	// CONTAINER id: 3400
	//    INFO
	//    DOC_TOPICS
	//    GET TEXT BUTTONS
	//    TEXT
	//    GET FULL_TEXT

	var info = document.createElement('div');
	info.className = "info";
	info.id = "info_" + qid;
	info.innerHTML = "INFO";

	//var infobutton = document.createElement('button');
	//infobutton.id = "info_button_" + qid;
	//infobutton.innerHTML = "get info";
	//infobutton.onclick = function(){button_get_meta(this.id)};
	//info.appendChild(infobutton);
	container.appendChild(info);
	get_meta(qid);

	var doc_topics = document.createElement('div');
	doc_topics.id = "doc_topics_" + qid;
	container.appendChild(doc_topics);
	doc_topics.innerHTML = "DOC TOPICS";

	var get_text_buttons = document.createElement('div');
	get_text_buttons.className = "get_text_buttons";
	var TYPES = ["Raw", "Standardized", "Lemma"];
	for (var j = 0; j < TYPES.length; j++) {
	    var docbutton = document.createElement('button');
	    docbutton.id = "button_" + TYPES[j] + "_" + qid;
	    docbutton.innerHTML = TYPES[j];
	    docbutton.style.marginRight = '15px';
	    docbutton.style.backgroundColor= "Transparent";
	    docbutton.onclick = function(){button_get_truncated_document(this.id)};

	    get_text_buttons.appendChild(docbutton);
	}
	container.appendChild(get_text_buttons);

	var text = document.createElement('div');
	text.className = "text";
	text.id = "text_" + qid;
	text.innerHTML = "TEXT";
	container.appendChild(text);

	var get_full_text = document.createElement('div');
	get_full_text.id = "get_full_text_area_" + qid;
	get_full_text.className = "get_full_text";
	get_full_text.innerHTML = "FULL TEXT BUTTON";
	container.appendChild(get_full_text);

	document.getElementById('top_docs').appendChild(document.createElement("hr"));
	document.getElementById('top_docs').appendChild(container);
    }
}
