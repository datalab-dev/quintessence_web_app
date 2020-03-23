<?php

$docid = $_POST['docid'];

require_once("config.php");

// open mysqli conneciton
$corpus_con = getCorpusCon();



$keywords = [];
$docid = mysqli_real_escape_string($corpus_con, $docid);


$query = "SELECT Keyword FROM Keywords WHERE QID = '.$docid.';";
if ($result = $corpus_con->query($query)) {
    while ($row = $result->fetch_row()) {
	$keywords[] = $row[0];
    }
} // if query succesful

if (empty($keywords))
    $results = "";
else {
    $results = json_encode($keywords);
}

echo ($results);

mysqli_close($corpus_con);

?>
