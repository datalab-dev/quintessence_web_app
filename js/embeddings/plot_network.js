function nn_network(rn_data) {

    var processed_data = preprocess_recursive_neighbors_data(rn_data);

    // create a network
    var container = document.getElementById("mynetwork");
    container.innerHTML = ""; // clear if exists
    var n_data = {
	nodes: processed_data["nodes"],
	edges: processed_data["edges"]
    };

    // node options
    var node_opts = {
	shape: "dot", // so scaling is easy
	scaling: {
	    customScalingFunction: function (min, max, total, value) {
		return value / total;
	    },
	    min: 5,
	    max: 150,
	},
    };

    // interaction options
    var interaction_opts = {
	hover:  true,
	dragNodes: true,
	dragView: false,
	zoomView: false
    };

    var options = {
	interaction: interaction_opts,
	nodes: node_opts
    };

    var network = new vis.Network(container, n_data, options);
    // to add hover info...
    network.on("hoverNode", function(params) {
    });
}

function preprocess_recursive_neighbors_data(rn_data) {
    var threshold = 0.2;

    // create nodes
    var node_names = Object.keys(rn_data);
    var nodes = [];
    for (const [key,value] of Object.entries(rn_data)) {
	var color = "#97C2FC";
	if (key == node_names[0]) { color = "#ED2939"}
	var node= {
	    label: key,
	    id: key,
	    title: value["freq"],
	    value: value["freq"],
	    color: color
	}
	nodes.push(node);
    }// for each neighbor 
    console.log(nodes);

    // create edges
    var edges = [];
    var count = 0;
    var elist = [];
    for (const [key, value] of Object.entries(rn_data)){
	for (var i = 0; i < value["terms"].length; i++) {
	    var target = value["terms"][i];  
	    var score = value["scores"][i];

	    if (node_names.includes(target) && score >= threshold) {

		if (!elist.includes(target+":"+key)) {

		    var edge = {
			from: key,
			to: target,
			value: score,
			title: score
		    }; // create edge
		    count = count + 1;
		    edges.push(edge);
		    elist.push(key +":"+ target);
		}
	    }
	} // for each of the neighbors neighbors
    }// for each entry

    return(
	{
	    edges: edges,
	    nodes: nodes,
	}
    );
}
