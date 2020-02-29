<?php

if ($_POST) {
    $docid = $_POST['docid'];
} else {
    $docid = $argv[1];
}

require_once("config.php");

// open mysqli conneciton
$corpus_con = new mysqli($server, $user, $password, $corpusdb);

if (!$corpus_con) {
    echo "failed to connect to database!";
}

// $corpus_con->query("SET character_set_results = 'utf8', character_set_client = 'utf8', character_set_connection = 'utf8', character_set_database = 'utf8', character_set_server = 'utf8'");
mysqli_set_charset($corpus_con, 'utf8');

$meta = [];
$names = [];
$docid = mysqli_real_escape_string($corpus_con, $docid);

$query = "SELECT * FROM Metadata WHERE QID = '".$docid."';";

if ($result = $corpus_con->query($query)) {
    while ($row = $result->fetch_row()) {
	$meta[] = $row;
    }
} // if query succesful
$query = "SHOW COLUMNS FROM Metadata;";
if ($result = $corpus_con->query($query)) {
    while ($row = $result->fetch_row()) {
	$names[] = $row[0];
    }
} // if query succesful

$combined = [];
for ($i = 0; $i < count($names); $i++) {
    $combined[$names[$i]] = $meta[0][$i];
}


if (empty($combined))
    $results = "";
else {
    $results = json_encode($combined);
}

echo ($results);
// echo "SELECT * FROM Metadata WHERE QID = '".$docid."';";;

mysqli_close($corpus_con);

?>
