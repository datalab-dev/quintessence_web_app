function initDocumentResults(qids, NDOCS, kwics) {
    console.log("init documents results", qids, NDOCS);
    document.getElementById("top_docs").innerHTML = "";
    document.getElementById("hideme").style.display = "inline";

    /* set title */
    var title = `<h3>Document Results (${qids.length})</h3>`;
    if (kwics !== undefined)
        title = `<h3>Examples of ${$("#tokens").val()} in Context<h3>`;
    $("#top_docs").append(title);

    /* document containers */
    for (var i = 0; i < NDOCS; i++) {
        qid = qids[i];
        $("#top_docs").append(`
            <div class="doc_container" id="${qid}">
            	<div class="info" id="info_${qid}"></div>
            	<div class="tdbuttons" id="tdbuttons_${qid}">
            		<button class="doc_button" id="refidsbtn_${qid}">
                        Reference IDs
                    </button>
            		<button class="doc_button" id="samplebtn_${qid}">
                        Sample Text
                    </button>
            		<button class="doc_button" id="fullbtn_${qid}">
                        Full Document
                    </button>
            	</div>
            	<div class="modal-container" id="modal-container${qid}">
            		<div class="modal" id="modal_refs_${qid}">
            			<div class="modal-content" id="refs_${qid}">
            				<span class="close" id="close1_${qid}">×</span>
            			</div>
            		</div>
            		<div class="modal" id="modal_sample_${qid}">
            			<div class="modal-content" id="sample_${qid}">
            				<span class="close" id="close2_${qid}">×</span>
            			</div>
            		</div>
            	</div>
            </div>
        `);

        /* doc buttons */
        $(`#refidsbtn_${qid}`).click(function() {
            document.getElementById("modal_refs_" +
                this.id.split("_")[1]).style.display = "block";
        });
        $(`#samplebtn_${qid}`).click(function() {
            document.getElementById("modal_sample_" +
                this.id.split("_")[1]).style.display = "block";
        });
        $(`#fullbtn_${qid}`).click(function() {
	    var id = $(this).attr('id');
	    var q = id.split('_')[1];
            buttonGetFullDocument(q);
        });

        /* close buttons */
        $(`#close1_${qid}`).click(function() {
            document.getElementById("modal_refs_" +
                this.id.split("_")[1]).style.display = "none";
        });
        $(`#close2_${qid}`).click(function() {
            document.getElementById("modal_sample_" +
                this.id.split("_")[1]).style.display = "none";
        });

        if (kwics !== undefined) {
            getMeta(qid, kwics[i]);
        } else {
            getMeta(qid);
        }
        getTruncatedDocument(qid);
        $("#top_docs").append("<hr>");
    }
}
