const DEFAULT_TOPIC = 55;
const LDA_PCA_PLOT_NAME = 'ldapca';

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
        b: 50,
        t: 50,
        pad: 0
    },
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
};

/* get topic data and initialize the lda pca plot */
function initLdaPca() {
    $.getJSON('./php/get_init_lda.php', function(data) {
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

function topString(arr) {
    const n = 60; // max length of string
    var s = "";
    for (const elem of arr) {
        str = (elem.length > n) ? elem.substr(0, n-1) + '...' : elem;
        s += `    ${str}<br>`
    }
    return s;
}

/* given the topic data draw the lda pca plot */
function plotLdaPca(topics, annotations = true) {
    var category = $("input[name='category']:checked").val();

    /* generate plot data from topic objects */
    var xs = [], ys = [], sizes = [], texts = [], colors = [], topTerms = [];
    for (const topic of topics) {
        var proportion = topic['proportion'] * 100;
        xs.push(topic['x']);
        ys.push(topic['y']);
        sizes.push(proportion * 10);
        texts.push(
            `Topic ID: ${topic['_id']}<br>` +
            `Proportion: ${proportion.toFixed(2)}%<br>` +
            `Top ${category}: <br>${topString(topic[category])}`);
        colors.push('#1f77b4');
        topTerms.push(topic['topTerms']);
    }

    /* plot data */
    var trace = {
        x: xs,
        y: ys,
        text: texts,
        hovertemplate: '%{text}',
        hoverlabel: {
            namelength: 0,
            align: 'left'
        },
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

    if (annotations == false)
        ldaPcaLayout.annotations = null;

    Plotly.newPlot(LDA_PCA_PLOT_NAME, [trace], ldaPcaLayout,
        {displayModeBar: false});
    updateLdaPcaColors(DEFAULT_TOPIC - 1, colors.slice(0), sizes);
    plotTopicTerms(DEFAULT_TOPIC, topTerms[DEFAULT_TOPIC - 1]);

    /* when a topic is selected update colors and plot topic terms */
    var ldaPcaPlot = document.getElementById(LDA_PCA_PLOT_NAME);
    ldaPcaPlot.on('plotly_click', function(data) {
        var pn = data.points[data.points.length - 1].pointNumber;
        updateLdaPcaColors(pn, colors.slice(0), sizes); // copy of colors
        plotTopicTerms(pn + 1, topTerms[pn]); // pass topic id and terms
    });

    document.getElementById("topics").innerHTML = JSON.stringify(topics);
}
