const range = (start, stop, step = 1) =>
    Array(Math.ceil((stop - start) / step)).fill(start).map((x, y) => x + y * step)

function topString(arr) {
    const n = 60; // max length of string
    var s = "";
    for (const elem of arr) {
	str = (elem.length > n) ? elem.substr(0, n-1) + '...' : elem;
	s += `    ${str}<br>`
    }
    return s;
}

function updateHoverInfo() {
    var category = $( "#" + CATEGORY_FORM_NAME ).val();
    var ldaPcaPlot = document.getElementById(LDA_PCA_PLOT_NAME);
    var fullinfos = ldaPcaPlot.data[0].customdata;
    var sizes = ldaPcaPlot.data[0].marker.size;
    var colors = Array(NTOPICS).fill("#1f77b4");
    colors[topicnum] = '#a91111';

    var update = {
	hovertemplate: [fullinfos[0][category]],
	'marker': {
	    color: colors,
	    size: sizes,
	    line: {
		color: 'black',
		width: 2
	    }
	}
    }

    Plotly.restyle(LDA_PCA_PLOT_NAME, update, 0);
}

function resetLdaPca() {
    // oof
    plotLdaPca(topicsdata, topicnum);
}

function resetLdaPcaDecades() {
    // oof
    plotLdaPcaDecades(topicsdata, topicnum);
}


/* update the colors of the lda pca plot */
function updateColors(selected) {
    // colors
    var colors = Array(NTOPICS).fill("#1f77b4");

    // get sizes
    var ldaPcaPlot = document.getElementById(LDA_PCA_PLOT_NAME);
    var sizes = ldaPcaPlot.data[0].marker.size;

    colors[selected] = '#a91111';
    var update = {
	'marker': {
	    color: colors,
	    size: sizes,
	    line: {
		color: 'black',
		width: 2
	    }
	}
    };
    Plotly.restyle(LDA_PCA_PLOT_NAME, update, 0);
}




function get_xy(coordinates) {
    // where coordinates is array of [x,y] arrays
    var x = [];
    var y = [];
    for (var i = 0; i < NTOPICS; i++) {
	x.push(coordinates[i][0] * 100);
	y.push(coordinates[i][1] * 100);
    }
    return {
	"x": x,
	"y": y}
}

function get_hover_text(topics_info_record) {
    // gets data for a single timeslot
    var fullinfo = {};
    fullinfo["topAuthors"] = [];
    fullinfo["topKeywords"] = [];
    fullinfo["topLocations"] = [];

    for (var i=0; i < NTOPICS; i++) {
	var prop = topics_info_record["proportions"][i] * 100;
	fullinfo["topAuthors"].push(
	    `Topic: ${i}<br>` +
	    `Proportion: ${prop.toFixed(2)}%<br>` +
	    `Top Authors: <br>${topString(topics_info_record["topAuthors"][i])}`);
	fullinfo["topKeywords"].push(
	    `Topic: ${i}<br>` +
	    `Proportion: ${prop.toFixed(2)}%<br>` +
	    `Top Keywords: <br>${topString(topics_info_record["topKeywords"][i])}`);
	fullinfo["topLocations"].push(
	    `Topic: ${i}<br>` +
	    `Proportion: ${prop.toFixed(2)}%<br>` +
	    `Top Locations: <br>${topString(topics_info_record["topLocations"][i])}`);
    }
    return fullinfo
}

function get_timeslot_data(topics_info_record) {
    // gets data for a single timeslot
    var bubblesizes = [];
    var ids = [];
    for (var i=0; i < NTOPICS; i++) {
	bubblesizes.push(topics_info_record["proportions"][i] * 100 * 10);
	ids.push(i);
    }

    var fullinfo = get_hover_text(topics_info_record);
    var colors = Array(NTOPICS).fill("#1f77b4");
    return {
	"ids": ids,
	"fullinfo": fullinfo,
	"bubblesizes": bubblesizes, 
	"colors": colors}
}
