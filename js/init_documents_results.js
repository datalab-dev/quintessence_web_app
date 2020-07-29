function init_documents_results(doc_ids_list, NDOCS, kwics) {
    console.log("init documents results", doc_ids_list, NDOCS);
    document.getElementById("top_docs").innerHTML = "";
    document.getElementById("hideme").style.display = "inline";

    title = document.createElement("h3");
    if (kwics !== undefined) {
        title.innerHTML = 'Examples of "' + document.getElementById("tokens").value + '" in Context';
    } else {
        title.innerHTML = "Document Results (" + doc_ids_list.length + ")";
    }

    document.getElementById("top_docs").appendChild(title);


    // for each document
    for (var i =0; i < NDOCS; i++) {

	qid = doc_ids_list[i];
	var container = document.createElement('div');
	container.className = "doc_container";
	container.id = qid;

	// CONTAINER [div] id: QID
	//    info [div]
	//    kwic_container (optional) [div]
	//    top_doc_buttons [div]
	//       Modal1 Button (ref ids) [button .doc_button]
	//       Modal2 Button (sample) [button .doc_button]
	//       Button (full text) [button .doc_button]
	//    modal_containers [div]
	//       modal1 [div]
	//         content
	//           close [.close] [span]
	//       modal2 [div]
	//         content
	//           close [.close] [span]

	// ADD EMPTY DIVS TO CONTAINER

	// INFO
	var info = document.createElement('div');
	info.className = "info";
	info.id = "info_" + qid;


	// TOP DOC BUTTONS
	var tdbuttons = document.createElement('div');
	tdbuttons.className = "tdbuttons";
	tdbuttons.id = "tdbuttons_" + qid;

	//    button1 (Reference Ids)
	var refidsbtn = document.createElement('button');
	refidsbtn.className = "doc_button";
	refidsbtn.id = "refidsbtn_" + qid;
	refidsbtn.innerHTML = "Reference IDs";
	refidsbtn.onclick = function() {
	    console.log(this.id);
	    document.getElementById("modal_refs_" + this.id.split("_")[1]).style.display = "block";
	}

	//    button2 (Sample)
	var samplebtn = document.createElement('button');
	samplebtn.className = "doc_button";
	samplebtn.id = "samplebtn_" + qid;
	samplebtn.innerHTML = "Sample Text"
	samplebtn.onclick = function() {
	    document.getElementById("modal_sample_" + this.id.split("_")[1]).style.display = "block";
	}

	//    button3 (Full Text)
	var fullbtn = document.createElement('button');
	fullbtn.className = "doc_button";
	fullbtn.id = "fullbtn_" + qid;
	fullbtn.innerHTML = "Full Document"
        fullbtn.onclick = function(){button_get_full_document(this.id)};

	tdbuttons.appendChild(refidsbtn);
	tdbuttons.appendChild(samplebtn);
	tdbuttons.appendChild(fullbtn);

	// MODAL CONTAINERS
	var modal_container = document.createElement('div');
	modal_container.className = "modal-container";
	modal_container.id = "modal-container" + qid;

	//    modal1 (Reference IDS)
	var mrefs = document.createElement('div');
	mrefs.className = "modal";
	mrefs.id = "modal_refs_" + qid;
	var mrefscontent = document.createElement('div');
	mrefscontent.className = "modal-content";
	mrefscontent.id = "refs_" + qid;
	var close1 = document.createElement('span');
	close1.className = "close";
	close1.id = "close1_" + qid;
	close1.innerHTML = "&times";
	close1.onclick = function() {
	    console.log(this.id);
	    document.getElementById("modal_refs_" + this.id.split("_")[1]).style.display = "none";
	}
	mrefscontent.appendChild(close1);
	mrefs.appendChild(mrefscontent);


	//    modal2 (Sample)
	var msample = document.createElement('div');
	msample.className = "modal";
	msample.id = "modal_sample_" + qid;
	var samplecontent = document.createElement('div');
	samplecontent.className = "modal-content";
	samplecontent.id = "sample_" + qid;
	var close2 = document.createElement('span');
	close2.className = "close";
	close2.id = "close2_" + qid;
	close2.innerHTML = "&times";
	close2.onclick = function() {
	    document.getElementById("modal_sample_" + this.id.split("_")[1]).style.display = "none";
	}
	samplecontent.appendChild(close2);
	msample.appendChild(samplecontent);

	modal_container.appendChild(mrefs);
	modal_container.appendChild(msample);

    if (kwics !== undefined) {
        get_meta(qid, kwics[i]);
    } else {
        get_meta(qid);
    }
	get_truncated_document(qid);
    container.appendChild(info);

    // KWIC
    // var tables = container.getElementsByTagName('table');
    // console.log(tables);
    // if (kwics !== undefined) {
    //     var kwic_obj = document.createElement('div');
    //     kwic_obj.innerHTML = kwics[i];
    //     container.appendChild(kwic_obj);
    // }


	container.appendChild(tdbuttons);
	container.appendChild(modal_container);

	document.getElementById('top_docs').appendChild(container);
	document.getElementById('top_docs').appendChild(document.createElement("hr"));
    }
}
