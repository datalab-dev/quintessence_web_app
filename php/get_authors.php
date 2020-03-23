<?php

$docid = $_POST['docid'];

require_once("config.php");

// open mysqli conneciton
$corpus_con = getCorpusCon();



$authors = [];
$docid = mysqli_real_escape_string($corpus_con, $docid);


$query = "SELECT Author FROM Authors WHERE QID = '.$docid.';";
if ($result = $corpus_con->query($query)) {
    while ($row = $result->fetch_row()) {
	$authors[] = $row[0];
    }
} // if query succesful

if (empty($authors))
    $results = "";
else {
    $results = json_encode($authors);
}

echo ($results);

mysqli_close($corpus_con);

?>
