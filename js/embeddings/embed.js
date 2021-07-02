var nndata;  // global variable
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


    // word change tab
    $.getJSON('./php/get_timeseries_terms.php', function(tsterms) {
	$('#timeseries-tokens').autocomplete({
	    delay: 0,
	    minLength: 3,
	    source: function(request, response) {
		var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( request.term ), "i" );
		response( $.grep( tsterms, function( item ){
		    return matcher.test( item );
		}) );
	    },
	    select: function(e, ui) {
		var tsterm = ui.item.value;

		// clear plot
		//$('#nn-plot').empty();

		// get time series data
		$.getJSON(`./php/get_timeseries.php?term=${tsterm}`, function(data) {
		    plotWordChange(data);
		}); // get_timeseries term
	    } // select
	}); //autocomplete
    }); // get timeseries terms

    // Most Similar words Tab
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
		$('#category-select').hide();
		$('#model-select').empty();
		$('#model-select').hide();

		// clear result
		$('#result').empty();

		$.getJSON(`./php/get_neighbors.php?term=${term}`, function(data) {

		    nndata = data;

		    // get categories
		    let categories = Object.keys(nndata);
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
		        nn = nndata[category];
		        //let tbl = make_table_from_neighbors_data(nn);
		        //$('#result').append(tbl);
		        $.getJSON(`./php/get_recursive_neighbors.php?term=${term}&topn=10&modelname=full&modeltype=full`, function(data) {
			    nn_network(data);
			});
		    } else {
			    $('#model-select').empty()
			    let models = Object.keys(nndata[category]);
			    models = models.sort();

		            for (var i = 0; i < models.length; i++) {
		                $('#model-select').append(
		                    $('<option></option').text(models[i]).val(models[i]));
		            }
			    $('#model-select').show();
                             
		            let model = $( "#model-select option:selected" ).text();
		            $('#result').empty();
			    nn = nndata[category][model];
		            //let tbl = make_table_from_neighbors_data(nn);
		            //$('#result').append(tbl);
		            $.getJSON(`./php/get_recursive_neighbors.php?term=${term}&topn=10&modelname=${model}&modeltype=${category}`, function(data) {
			        nn_network(data);
			    });
		    }

		    $('#category-select').show();

		    // UPDATE ON USER INPUT
		    // if user selects a category
                    $('#category-select').on('change', function() {
			let category = this.value;

			if (category !== "full") {
			    $('#model-select').empty()
			    let models = Object.keys(nndata[category]);
			    models = models.sort();

		            for (var i = 0; i < models.length; i++) {
		                $('#model-select').append(
		                    $('<option></option').text(models[i]).val(models[i]));
		            }
			    $('#model-select').show();
                             
		            let model = $( "#model-select option:selected" ).text();
		            $('#result').empty();
			    nn = nndata[category][model];
		            // let tbl = make_table_from_neighbors_data(nn);
		            // $('#result').append(tbl);
		            $.getJSON(`./php/get_recursive_neighbors.php?term=${term}&topn=10&modelname=${model}&modeltype=${category}`, function(data) {
			        nn_network(data);
			    });

			} else {
			    $('#model-select').empty();
		            $('#result').empty();
			    $('#model-select').hide();
		            nn = nndata[category];
		            //let tbl = make_table_from_neighbors_data(nn);
		            //$('#result').append(tbl);
		            $.getJSON(`./php/get_recursive_neighbors.php?term=${term}&topn=10&modelname=${model}&modeltype=${category}`, function(data) {
			        nn_network(data);
			    });
			}
		    }); // select category

		    // if user selects a model
                    $('#model-select').on('change', function() {
		        $('#result').empty();
		        let category = $( "#category-select option:selected" ).text();
			console.log(category, this.value);
			nn = nndata[category][this.value];
		        //let tbl = make_table_from_neighbors_data(nn);
		        // $('#result').append(tbl);
		            $.getJSON(`./php/get_recursive_neighbors.php?term=${term}&topn=10&modelname=${this.value}&modeltype=${category}`, function(data) {
			        nn_network(data);
			    });
		    }); //select model


		}); // get neighbors
	    } // when term is selected
	});
    });
}); // on ready

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
