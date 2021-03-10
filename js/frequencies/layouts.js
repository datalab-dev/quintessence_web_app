var freq_layout = {
    title: ' ',
    autosize: false,
    xaxis: {
        title: 'Year',
        gridcolor: 'rgb(243, 243, 243)',
        type: 'linear',
        range: [1470, 1700],
        dtick: 10,
        zerolinewidth: 1,
        ticklen: 1,
        gridwidth: 1
    },
    yaxis: {
        title: 'Relative Frequency',
        gridcolor: 'rgb(243, 243, 243)',
        gridwidth: 1,
        rangemode: 'tozero',
	exponentformat: "none",
        showticklabels: true,
	tickformat: '.2%',
        ticklen: 1,
        showline: true
    },
    rangemode: 'nonnegative',
    paper_bgcolor: 'rgb(243, 243, 243)',
    plot_bgcolor: 'rgb(243, 243, 243)',
    showlegend: true,
    hovermode: 'closest',
    width: 1024,
    height: 600
};

var overall_freq_layout = {
    title: ' ',
    autosize: false,
    xaxis: {
        title: 'Year',
        gridcolor: 'rgb(243, 243, 243)',
        type: 'linear',
        range: [1470, 1700],
        dtick: 10,
        zerolinewidth: 1,
        ticklen: 1,
        gridwidth: 1
    },
    yaxis: {
        title: 'Count',
        gridcolor: 'rgb(243, 243, 243)',
        // layer: 'below traces',
        gridwidth: 1,
        showticklabels: true,
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
