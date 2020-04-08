<?php

$docid = $_POST['docid'];

require_once("config.php");

// open mysqli conneciton
$corpus_con = getCorpusCon();


$languages = [];
$docid = mysqli_real_escape_string($corpus_con, $docid);


$query = "SELECT Language FROM Languages WHERE QID = '$docid';";
if ($result = $corpus_con->query($query)) {
    while ($row = $result->fetch_row()) {
	$languages[] = $row[0];
    }
} // if query succesful

if (empty($languages))
    $results = "";
else {
    $results = json_encode($languages);
}

echo ($results);

mysqli_close($corpus_con);

?>
