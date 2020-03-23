<?php

require_once("config.php");

// open mysqli conneciton
$models_con = getModelsCon();

$proportion = [];
$topic = [];

$query = "SELECT * FROM topic_proportions;";
if ($result = $models_con->query($query)) {
    while ($row = $result->fetch_row()) {
	$proportion[] = $row[0] * 100;
	$topic[] = $row[1];
    }
} // if query succesful


$x = [];
$y = [];
$topics = [];
$query = "SELECT * FROM topic_terms_pca;";
if ($result = $models_con->query($query)) {
    while ($row = $result->fetch_row()) {
	$x[] = $row[0];
	$y[] = $row[1];
	$topics[] = $row[2];
    }
} // if query succesful

$tp = [];
$tp['proportion'] = $proportion;
$tp['topic'] = $topic;

$pca = [];
$pca['x'] = $x;
$pca['y'] = $y;
$pca['topics'] = $topics;

$combined['pca'] = $pca;
$combined['tp'] = $tp;

if (empty($combined))
    $results = "";
else {
    $results = json_encode($combined);
}

echo ($results);

mysqli_close($models_con);

?>
