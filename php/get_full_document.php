<?php

$docid = $_POST['docid'];
$type = $_POST['type'];

require_once("config.php");

// open mysqli conneciton
$corpus_con = new mysqli($server, $user, $password, $corpusdb);

if (!$corpus_con) {
    echo "failed to connect to database!";
}


$docid = mysqli_real_escape_string($corpus_con, $docid);
$type = mysqli_real_escape_string($corpus_con, $type);

$query = "SELECT ".$type." FROM ".$type." WHERE QID = '".$docid."';";
    if ($result = $corpus_con->query($query)) {
        while ($row = $result->fetch_row()) {
    	$doc = $row[0];
        }
    } // if query succesful
    
    
if (empty($doc))
    $results = "";
else {
    $results = json_encode($doc);
}

echo ($results);

mysqli_close($corpus_con);

?>
