<?php

$docid = $_POST['docid'];
$type = $_POST['type'];

require_once("config.php");

// open mysqli conneciton
$corpus_con = new mysqli($server, $user, $password, $corpusdb);

if (!$corpus_con) {
    echo "failed to connect to database!";
}


$doc = "";
$docid = mysqli_real_escape_string($corpus_con, $docid);
// given docid get the id from File_IDs table
$query = "SELECT id FROM File_IDs WHERE File_ID = '".$docid."';";
if ($result = $corpus_con->query($query)) {
    while ($row = $result->fetch_row()) {
	$id = $row[0];
    }
}

if ($type == "XML") {
    $query = "SELECT XML FROM EEBO_XML WHERE id = '".$id."';";
    if ($result = $corpus_con->query($query)) {
        while ($row = $result->fetch_row()) {
    	$doc = $row[0];
        }
    } // if query succesful
}
else {
    $query = "SELECT ".$type." FROM EEBO_Corpus WHERE id = '".$id."';";
    if ($result = $corpus_con->query($query)) {
        while ($row = $result->fetch_row()) {
    	$doc = $row[0];
        }
    } // if query succesful
}
    
    
if (empty($doc))
    $results = "";
else {
    $results = json_encode($doc);
}

echo ($results);

mysqli_close($corpus_con);

?>
