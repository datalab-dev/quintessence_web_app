/* given document id get metadata and create tables on page */
function getMeta(qid, kwic) {
    $.getJSON(`./php/get_meta.php?qid=${qid}`, function(data) {
        if (kwic != undefined)
            data["word in context"] = kwic;

        parseMeta(data, qid);
    });
}

function addTable(tname, keys, data) {
    for (const key of keys) {
        if (data[key] == undefined)
            continue;

        $(`${tname} tbody`).append(`
            <tr>
                <td class="keys">${key}</td>
                <td class="values">${data[key]}</td>
            </tr>
        `);
    }
}

/* create metadata tables */
function parseMeta(data, qid) {
    var idKeys = ["qid", "fileId", "stcId", "estcId", "eeboCitation",
                  "proquestId", "vid"];
    var mainKeys = ["title", "author", "location", "publisher", "date",
                    "wordCount"];

    data["qid"] = qid;
    if (data["word in context"] != undefined)
        mainKeys.push("word in context");

    /* main container */
    var tname = `#info_${qid}`;
    $(tname).append("<table><tbody></tbody></table>");
    addTable(tname, mainKeys, data);

    /* refs container */
    tname = `#refs_${qid}`;
    $(tname).append("<h2>Reference IDs</h2>");
    $(tname).append("<table><tbody></tbody></table>");
    addTable(tname, idKeys, data);
}
