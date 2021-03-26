function update_topics_info(parent_div, topic) {
 /// given topic (can be triggered by clicking a point, or by search)
/// populate the three tabs
/// tabs are: topic terms, 
///           topic info (proportion, keywords, authors, locations)
///           topic neighbors (nearest neighbors)



    // 1. Top Terms tab
    plotTopicTerms(topicId, topterms);

    // 2. Info Tab
    //
    // proportion plot
    // decade dropdown
    // keywords, authors, locations

    plot_topic_proportion(proportions, proportions_plot_name);

    // 3. Top Documents Tab (will become most similar topics)

    return;
}
