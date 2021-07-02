function nn_network() {

        // create an array with nodes
        var nodes = new vis.DataSet([
	        { id: 1, label: "Node 1", value: 100 },
	        { id: 2, label: "Node 2", value: 7},
	        { id: 3, label: "Node 3", value: 200 },
	        { id: 4, label: "Node 4", value: 1000 },
	        { id: 5, label: "Node 5", value: 200 }
	        ]);

        // create an array with edges
        var edges = new vis.DataSet([
	        { from: 1, to: 3 },
	        { from: 1, to: 2 },
	        { from: 2, to: 4 },
	        { from: 2, to: 5 }
	        ]);

        // create a network
        var container = document.getElementById("mynetwork");
        container.innerHTML = ""; // clear if exists
        var data = {
	        nodes: nodes,
	        edges: edges
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
	        dragNodes: false,
	        dragView: false,
	        zoomView: false
	        };

        var options = {
	        interaction: interaction_opts,
	        nodes: node_opts
	        };

        var network = new vis.Network(container, data, options);
}
