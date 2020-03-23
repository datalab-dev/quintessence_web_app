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


$combined = [];
$combined['proportion'] = $proportion;
$combined['topic'] = $topic;

if (empty($combined))
    $results = "";
else {
    $results = json_encode($combined);
}

echo ($results);

mysqli_close($models_con);

?>
