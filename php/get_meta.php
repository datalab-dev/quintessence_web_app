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

mysqli_close($corpus_con);

?>
