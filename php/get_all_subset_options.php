<?php

require_once("config.php");

// open mysqli conneciton
$corpus_con = new mysqli($server, $user, $password, $corpusdb);
mysqli_set_charset($corpus_con, "utf8");

if (!$corpus_con) {
    echo "failed to connect to database!";
}



$keywords = [];
$query = "SELECT Keyword FROM Keywords;"; 
if ($result = $corpus_con->query($query)) {
    while ($row = $result->fetch_row()) {
	$keywords[] = $row[0];
    }
} // if query succesful
$keywords = array_unique($keywords);

$authors = [];
$query = "SELECT Author FROM Authors;"; 
if ($result = $corpus_con->query($query)) {
    while ($row = $result->fetch_row()) {
	$authors[] = $row[0];
    }
} // if query succesful
$authors = array_unique($authors);

$locations = [];
$query = "SELECT Location FROM Metadata;"; 
if ($result = $corpus_con->query($query)) {
    while ($row = $result->fetch_row()) {
	$locations[] = $row[0];
    }
} // if query succesful
$locations = array_unique($locations);



$full["keywords"] = $keywords;
$full["authors"] = $authors;
$full["locations"] = $locations;
$results = json_encode($full);

echo ($results);

mysqli_close($corpus_con);

?>
