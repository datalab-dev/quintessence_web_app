const DEFAULT_TOPIC = 10;
const LDA_PCA_PLOT_NAME = 'ldapca';

var ldaPcaLayout = {
    autosize: "false",
    hovermode: "closest",
    hoverdistance: 20,
    plot_bgcolor: 'rgb(243,243,243)',
    scrollZoom: "false",
    yaxis: {
        fixedrange: true,
        showgrid: false,
    },
    xaxis : {
        fixedrange: true,
        showgrid: false,
        ticks: '',
        showticklabels: false
    },
    height: 900,
    margin: {
        l: 0,
        r: 0,
        b: 50,
        t: 50,
        pad: 0
    },
    annotations: [
        {
            x: 0.0372,
            y: 0.1918,
            xref: 'Decades',
            yref: 'Word Change',
            text: 'each bubble represents <br> one topic',
            showarrow: true,
            arrowhead: 0,
            ax: -41,
            ay: -40
        },
        {
            x: -0.003,
            y: -0.1067,
            xref: 'Decades',
            yref: 'Word Change',
            text: 'color indicates <br> topic cluster',
            showarrow: true,
            arrowhead: 0,
            ax: -70,
            ay: 0
        },
        {
            x: -0.2138,
            y: 0.0802,
            xref: 'Decades',
            yref: 'Word Change',
            text: 'sizes reflect topic prevalence <br> in chosen subset',
            showarrow: true,
            arrowhead: 0,
            ax: 20,
            ay: -140
        },
        {
            x: -0.1505,
            y: 0.1335,
            xref: 'Decades',
            yref: 'Word Change',
            text: '',
            showarrow: true,
            arrowhead: 0,
            ax: -50,
            ay: -48
        },
        {
            x: 0.1229,
            y: 0.0558,
            xref: 'Decades',
            yref: 'Word Change',
            text: 'click bubble to view <br> terms in topic',
            showarrow: true,
            arrowhead: 0,
            ax: -50,
            ay: -75
        }
    ]
};

/* get topic data and initialize the lda pca plot */
function initLdaPca() {
    $.getJSON('./json/topics.json', function(data) {
        plotLdaPca(data);
    });
}

/* update the colors of the lda pca plot */
function updateLdaPcaColors(selected, colors, sizes) {
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

/* given the topic data draw the lda pca plot */
function plotLdaPca(topics) {
    /* generate plot data from topic objects */
    var xs = [], ys = [], sizes = [], texts = [], colors = [], topTerms = [];
    topics.forEach(function(topic) {
        var proportion = topic['proportion'] * 100;
        xs.push(topic['x']);
        ys.push(topic['y']);
        sizes.push(proportion * 10);
        texts.push(`Topic ID: ${topic['_id']}` + '<br>' +
                   `Proportion: ${proportion.toFixed(2)}%`);
        colors.push('#1f77b4');
        topTerms.push(topic['topTerms']);
    });

    /* plot data */
    var trace = {
        x: xs,
        y: ys,
        text: texts,
        hovertemplate: '%{text}',
        hoverlabel: {namelength: -1},
        textposition: 'bottom',
        mode: 'markers',
        type: 'scatter',
        marker: {
            sizes: sizes,
            color: '#1f77b4',
            line: {
                color: 'black',
                width: 2
            }
        }
    }
    Plotly.newPlot(LDA_PCA_PLOT_NAME, [trace], ldaPcaLayout,
        {displayModeBar: false});
    updateLdaPcaColors(DEFAULT_TOPIC, colors.slice(0), sizes); // copy of colors

    /* when a topic is selected update colors and plot topic terms */
    var ldaPcaPlot = document.getElementById(LDA_PCA_PLOT_NAME);
    ldaPcaPlot.on('plotly_click', function(data) {
        var pn = data.points[data.points.length - 1].pointNumber;
        updateLdaPcaColors(pn, colors.slice(0), sizes); // copy of colors
        plotTopicTerms(pn + 1, topTerms[pn]); // pass topic id and terms
    });

    document.getElementById("topics").innerHTML = JSON.stringify(topics);
}
