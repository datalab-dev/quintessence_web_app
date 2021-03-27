function update_topics_info(topic, topicdata) {
    // topic is a number
    // topicdata has proportions, authors, keywords, locations, topterms

    document.getElementById("selected_topic").innerHTML = "Selected Topic: " + topic;

 /// given topic (can be triggered by clicking a point, or by search)
/// populate the three tabs
/// tabs are: topic terms, 
///           topic info (proportion, keywords, authors, locations)
///           topic neighbors (nearest neighbors)


    // 1. Top Terms tab
    plotTopicTerms(topic, topicdata["topterms"]);

    // 2. Info Tab
    //
    // proportion plot
    // decade dropdown
    // keywords, authors, locations
    plot_topic_proportion(topicdata["proportions"], TOPIC_PROPORTIONS_PLOT_NAME);

    // dropdown
    // decades
    var decades = Object.keys(topicdata["authors"]);
    var decade_select  = document.getElementById('decade_dropdown');

    update_tables(topicdata, "full");


    // 3. Similar topics Tab 
    // create table

    return;
}

function update_tables(topicdata, decade) {
    var authors = topicdata["authors"][decade];
    var keywords = topicdata["keywords"][decade];
    var locations = topicdata["locations"][decade];

    var authors_div = document.getElementById("topAuthorsDecade");
    var keywords_div = document.getElementById("topKeywordsDecade");
    var locations_div = document.getElementById("topLocationsDecade");

    authors_div.innerHTML = "";
    keywords_div.innerHTML = "";
    locations_div.innerHTML = "";


    authors_div.appendChild(create_table(authors));
    keywords_div.appendChild(create_table(keywords));
    locations_div.appendChild(create_table(locations));
}

function create_table(arr) {
    let table = document.createElement("table");

    for (var i =0; i < arr.length; i++) {
	var row = table.insertRow(i);
	var cell1 = row.insertCell(0);
	cell1.innerHTML = arr[i];
    }
    return table;
}
