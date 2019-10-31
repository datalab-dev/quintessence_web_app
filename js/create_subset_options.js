function create_subset_options(data) {

    // keywords
    var kw = $(document.getElementById('selected-keywords')).selectize();
    var kws= kw[0].selectize;
    for (var i = 0; i < 100; i++) {
	var val = data["keywords"][i];
	kws.addOption({value:val, text:val});
    }

    // authors
    var a = $(document.getElementById('selected-authors')).selectize();
    var as= a[0].selectize;
    for (var i = 0; i < 100; i++) {
	var val = data["authors"][i];
	as.addOption({value:val, text:val});
    }

    // loations
    console.log(data["locations"]);
    var l = $(document.getElementById('selected-locations')).selectize();
    var ls= l[0].selectize;
    for (var i = 0; i < data["locations"].length; i++) {
	var val = data["locations"][i];
	ls.addOption({value:val, text:val});
    }
}
