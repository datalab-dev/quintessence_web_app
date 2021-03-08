$(document).ready(function() {
    /* configure tabs */
    $('#tabs a:not(:first)').addClass('inactive');
    $('.container:not(:first)').hide();
    $('#tabs a').click(function(){
	var t = $(this).attr('href');
	$('#tabs a').addClass('inactive');
	$(this).removeClass('inactive');
	$('.container').hide();
	$(t).fadeIn('slow');

	return false;
    })

    $.getJSON('./php/get_embeddings_terms.php', function(terms) {
	$('#tokens').autocomplete({
	    delay: 0,
	    minLength: 3,
	    source: function(request, response) {
		var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( request.term ), "i" );
		response( $.grep( terms, function( item ){
		    return matcher.test( item );
		}) );
	    },
	    select: function(e, ui) {
		// When term is selected:
		var term = ui.item.value;

		// clear dropdown menu
		$('#category-select').empty();
		$('#model-select').empty();
		$('#model-select').hide();

		// clear result
		$('#result').empty();

		$.getJSON(`./php/get_neighbors.php?term=${term}`, function(data) {

		    // get categories
		    let categories = Object.keys(data);
		    categories = categories.filter(e => e !== '_id');

		    // populate categories dropdown menu
		    for (var i = 0; i < categories.length; i++) {
			$('#category-select').append(
			    $('<option></option').text(categories[i]).val(categories[i]));
		    }

		    // DEFAULT BEHAVIOR
		    // if none selected it defaults to first (probably 'full')
		    let category = $( "#category-select option:selected" ).text();

		    if (category == "full") {
		        nn = data[category];
		        let tbl = make_table_from_neighbors_data(nn);
		        $('#result').append(tbl);
		    } else {
			    $('#model-select').empty()
			    let models = Object.keys(data[category]);

		            for (var i = 0; i < models.length; i++) {
		                $('#model-select').append(
		                    $('<option></option').text(models[i]).val(models[i]));
		            }
			    $('#model-select').show();
                             
		            let model = $( "#model-select option:selected" ).text();
		            $('#result').empty();
			    nn = data[category][model];
		            let tbl = make_table_from_neighbors_data(nn);
		            $('#result').append(tbl);
		    }

		    // UPDATE ON USER INPUT
		    // if user selects a category
                    $('#category-select').on('change', function() {
			let category = this.value;

			if (category !== "full") {
			    $('#model-select').empty()
			    let models = Object.keys(data[category]);

		            for (var i = 0; i < models.length; i++) {
		                $('#model-select').append(
		                    $('<option></option').text(models[i]).val(models[i]));
		            }
			    $('#model-select').show();
                             
		            let model = $( "#model-select option:selected" ).text();
		            $('#result').empty();
			    nn = data[category][model];
		            let tbl = make_table_from_neighbors_data(nn);
		            $('#result').append(tbl);

			} else {
			    $('#model-select').empty();
		            $('#result').empty();
			    $('#model-select').hide();
		            nn = data[category];
		            let tbl = make_table_from_neighbors_data(nn);
		            $('#result').append(tbl);
			}
		    }); // select category

		    // if user selects a model
                    $('#model-select').on('change', function() {
		        $('#result').empty();
		        let category = $( "#category-select option:selected" ).text();
			console.log(category, this.value);
			nn = data[category][this.value];
		        let tbl = make_table_from_neighbors_data(nn);
		        $('#result').append(tbl);
		    }); //select model


		}); // get neighbors
	    } // when term is selected
	});
    });
}); // on ready

/* helper function which returns an array of ints given a range */
const range = (start, stop, step = 1) =>
    Array(Math.ceil((stop - start) / step)).fill(start).map((x, y) => x + y * step);

function getNnInfo(data) {
    var res = "";
    for (i = 19; i > 9; i--) {
	var n = data.neighbors[i];
	var p = (parseFloat(data.scores[i])*100).toFixed(2);
	res = res.concat(n, " - ", p, "%<br>");
    }
    return(res);
}

function make_table_from_neighbors_data(neighbors) {
    let table = document.createElement("table");

    for (var i =0; i < neighbors.terms.length; i++) {
	var row = table.insertRow(i);
	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);
	var cell3 = row.insertCell(2);
	cell1.innerHTML = neighbors.terms[i];
	cell2.innerHTML = neighbors.scores[i].toFixed(3);
	cell3.innerHTML = neighbors.freqs[i];
    }
    return table;
}

function replaceZero(arr) {
    for (i = 0; i < arr.length; i++) {
	if (arr[i] == "0") {
	    arr[i] = null;
	}
    }

    return arr;
}


/* given a term's nerest neighbors in 1700 get traces over time for all */
function getNnTraces(neighborsTimeseries, decades) {
    var traces = [];
    for (const neighbor of neighborsTimeseries) {
	var y = replaceZero(neighbor.timeseries);
	var trace = {
	    x: decades,
	    y: y,
	    mode: 'lines',
	    type: 'scatter',
	    line: {
		opacity: 0.7,
		color: 'rgb(128, 128, 128)',
		width: 0.5,
		shape: 'spline'
	    },
	    hovertext: neighbor.term,
	    hoverinfo: 'text',
	    // hovertemplate: '%{text}',
	    hoverlabel: {namelength :-1}
	}
	traces.push(trace);
    }

    return traces;
}
