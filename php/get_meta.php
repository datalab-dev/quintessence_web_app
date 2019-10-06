<?php

$docid = $_POST['docid'];

require_once("config.php");

// open mysqli conneciton
$corpus_con = new mysqli($server, $user, $password, $corpusdb);

if (!$corpus_con) {
    echo "failed to connect to database!";
}


$meta = [];
$names = [];
$docid = mysqli_real_escape_string($corpus_con, $docid);
// given docid get the id from File_IDs table
$query = "SELECT id FROM File_IDs WHERE File_ID = '".$docid."';";
if ($result = $corpus_con->query($query)) {
    while ($row = $result->fetch_row()) {
	$id = $row[0];
    }
}

$query = "SELECT * FROM EEBO_Metadata WHERE id = '".$id."';";
if ($result = $corpus_con->query($query)) {
    while ($row = $result->fetch_row()) {
	$meta[] = $row;
    }
} // if query succesful
$query = "SHOW COLUMNS FROM EEBO_Metadata;";
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

mysqli_close($corpus_con);

?>
