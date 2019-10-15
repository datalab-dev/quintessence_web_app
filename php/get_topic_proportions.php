<?php

require_once("config.php");

// open mysqli conneciton
$models_con = new mysqli($server, $user, $password, $modelsdb);

if (!$models_con) {
    echo "failed to connect to database!";
}

$x = [];
$y = [];
$topics = [];

$query = "SELECT * FROM topic_proportions;";
if ($result = $models_con->query($query)) {
    while ($row = $result->fetch_row()) {
	$x[] = $row[0];
	$y[] = $row[1];
	$topics[] = $row[2];
    }
} // if query succesful


$combined = [];
$combined['x'] = $x;
$combined['y'] = $y;
$combined['topics'] = $topics;

if (empty($combined))
    $results = "";
else {
    $results = json_encode($combined);
}

echo ($results);

mysqli_close($models_con);

?>
