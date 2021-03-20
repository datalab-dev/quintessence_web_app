var topicTermsLayout = {
    barmode: 'stack',
    staticPlot: false,
    autosize: false,
    showlegend: false,
    height: 880,
    width: 400,
    plot_bgcolor: 'rgb(243,243,243)',
    margin: {
	l: 130,
	r: 0,
	b: 0,
	t: 0,
	pad: 0
    },
    xaxis: {
	autorange: true,
	showgrid: false,
	zeroline: false,
	showline: false,
	autotick: true,
	ticks: '',
	showticklabels: false
    },
    yaxis: {
	autorange: "reversed",
	fixedrange: true,
	showgrid: false,
	zeroline: false,
	showline: false,
	autotick: true,
	ticks: '',
	showticklabels: true
    },
};
var ldaPcaLayout = {
    autosize: "false",
    hovermode: "closest",
    hoverdistance: 20,
    plot_bgcolor: 'rgb(243,243,243)',
    scrollZoom: "false",
    xaxis : {
	fixedrange: true,
	showgrid: false,
	ticks: '',
	showticklabels: false,
    },
    yaxis: {
	fixedrange: true,
	showgrid: false
    },
    height: 900,
    margin: {
	l: 0,
	r: 0,
	b: 0,
	t: 0,
	pad: 0
    },
    /* these need to be fixed, x and y coordinates updated; one way is to se the label as the (x,y) and then record the locations 
    annotations: [
	{
	    x: -432173.5,
	    y: 2016225,
	    xref: 'Decades',
	    yref: 'Word Change',
	    text: 'each bubble represents <br> one topic',
	    showarrow: true,
	    arrowhead: 0,
	    ax: -41,
	    ay: -40
	},
	{
	    x: 1010927,
	    y: 457759.1,
	    xref: 'Decades',
	    yref: 'Word Change',
	    text: 'color indicates <br> topic cluster',
	    showarrow: true,
	    arrowhead: 0,
	    ax: 70,
	    ay: 0
	},
	{
	    x: -1329386,
	    y: -450149.8,
	    xref: 'Decades',
	    yref: 'Word Change',
	    text: 'sizes reflect topic prevalence <br> in chosen subset',
	    showarrow: true,
	    arrowhead: 0,
	    ax: -150,
	    ay: 50
	},
	{
	    x: -353226.6,
	    y: -1098607,
	    xref: 'Decades',
	    yref: 'Word Change',
	    text: '',
	    showarrow: true,
	    arrowhead: 0,
	    ax: -180,
	    ay: -20
	},
	{
	    x: 94523.23,
	    y: 990735.9,
	    xref: 'Decades',
	    yref: 'Word Change',
	    text: 'click bubble to view <br> terms in topic',
	    showarrow: true,
	    arrowhead: 0,
	    ax: 50,
	    ay: -75
	}
    ]
    */
};

var topic_proportion_layout = {
    title: ' ',
    autosize: false,
    xaxis: {
        title: 'Year',
        gridcolor: 'rgb(243, 243, 243)',
        type: 'bar',
        range: [1470, 1700],
        dtick: 10,
        zerolinewidth: 1,
        ticklen: 1,
        gridwidth: 1
    },
    yaxis: {
        title: 'Proportion',
        gridcolor: 'rgb(243, 243, 243)',
        gridwidth: 1,
        showticklabels: true,
	tickformat: '.2%',
        ticklen: 1,
        showline: true
    },
    paper_bgcolor: 'rgb(243, 243, 243)',
    plot_bgcolor: 'rgb(243, 243, 243)',
    showlegend: false,
    hovermode: 'closest',
    width: 1024,
    height: 600
};
