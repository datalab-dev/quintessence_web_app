/* given document id get metadata and create tables on page */
function getMeta(qid, kwic) {
    $.getJSON(`./php/get_meta.php?qid=${qid}`, function(data) {
        if (kwic != undefined)
            data["Word in Context"] = kwic;

        parseMeta(data, qid);
    });
}

/* create metadata tables */
function parseMeta(data, docid) {
    var title = "";
    var ids = ["QID", "File_ID", "STC_ID", "ESTC_ID", "EEBO_Citation",
               "Proquest_ID", "VID"];
    var main = ["Title", "Author", "Location", "Publisher", "Date",
                "Word_Count", "Word in Context"];
    var main_container = document.getElementById("info_" + docid);
    main_container.innerHTML = "";
    var refs_container = document.getElementById("refs_" + docid);

    var main_table = document.createElement("table");
    for (var i = 0; i < Object.keys(data).length; i++) {
        var key = Object.keys(data)[i];
        if (main.includes(key)) {
            var row = main_table.insertRow(-1);
            var kcell = row.insertCell(-1)
            kcell.innerHTML = key;
            kcell.classList.add("keys");
            var vcell = row.insertCell(-1)
            vcell.innerHTML = data[key];
            vcell.classList.add("values");

            if (key == "Title")
                title = data[key];
        }
    }

    var header = document.createElement("h2");
    header.innerHTML = "Reference IDs";

    var id_table = document.createElement("table");
    for (var i = 0; i < Object.keys(data).length; i++) {
        var key = Object.keys(data)[i];
        if (ids.includes(key)) {
            var row = id_table.insertRow(-1);
            var kcell = row.insertCell(-1)
            kcell.innerHTML = key;
            kcell.classList.add("keys");
            var vcell = row.insertCell(-1)
            vcell.innerHTML = data[key];
            vcell.classList.add("values");
        }
    }

    main_container.appendChild(main_table);
    refs_container.appendChild(header);
    refs_container.appendChild(id_table);
}
