var timeseriesLayout = {
    autosize: true,
    height: 550,
    title: ' ',
    xaxis: {
        title: 'Decades',
        gridcolor: 'rgb(243, 243, 243)',
        type: 'linear',
        range: [1470, 1705],
        dtick: 10,
        zerolinewidth: 1,
        ticklen: 1,
        tickfont: {color: 'gray'},
        gridwidth: 1
    },
    yaxis: {
        title: 'term Change',
        gridcolor: 'rgb(243, 243, 243)',
        layer: 'below traces',
        range: [0, 1.05],
        dtick: 0.25,
        gridwidth: 1,
        showticklabels: true,
        tickmode: 'array',
        tickvals: [.25, .50, .75, 1.0],
        ticktext: ['25', '50', '75', '100%'],
        tickfont: {color: 'gray'}
    },
    paper_bgcolor: 'rgb(243, 243, 243)',
    plot_bgcolor: 'rgb(243, 243, 243)',
    showlegend: false,
    hovermode: 'closest',
    displayModeBar: false
};

var histLayout = {
    autosize: false,
    width: 1024,
    height: 550,
    barmode: 'stack',
    title: null,
    xaxis: {
        title: '',
        type: 'log',
        showgrid: false,
        showline: false,
        showticklabels: false,
        zeroline: false,
	hoverformat: '.2%'
    },
    yaxis: {
        showticklabels: false,
        showgrid: false,
        zeroline: false
    },
    margin: { l: 150, r: 50, b: 20, t: 75 },
    legend: { orientation: 'h' },
    paper_bgcolor: 'rgb(243, 243, 243)',
    plot_bgcolor: 'rgb(243, 243, 243)',
    autosize: true,
    displayModeBar: false
};

var timeseriesAnnotations = [
    {
        x: 1700,
        y: 1,
        xref: 'Decades',
        yref: 'term Change',
        text: 'each decade is <br> compared with 1700',
        showarrow: true,
        arrowhead: 6,
        ax: 0,
        ay: -40
    },
    {
        x: 1490,
        y: 0.4503,
        xref: 'Decades',
        yref: 'term Change',
        text: 'lowest point is most <br> different from 1700',
        showarrow: true,
        arrowhead: 6,
        ax: 0,
        ay: 40
    },
    {
        x: 1650,
        y: 0.4636,
        xref: 'Decades',
        yref: 'term Change',
        text: 'terms nearest to <br> term in 1700',
        showarrow: true,
        arrowhead: 6,
        ax: 20,
        ay: 40
    },
    {
        x: 1670,
        y: 0.572,
        xref: 'Decades',
        yref: 'term Change',
        text: '',
        showarrow: true,
        arrowhead: 6,
        ax: -50,
        ay: 56
    },
    {
        x: 1505,
        y: 0.67,
        xref: 'Decades',
        yref: 'term Change',
        text: 'abrupt increase indicates <br> term meaning change',
        showarrow: true,
        arrowhead: 2,
        ax: -90,
        ay: -85
    }
]
