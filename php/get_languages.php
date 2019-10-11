<?php

$docid = $_POST['docid'];

require_once("config.php");

// open mysqli conneciton
$corpus_con = new mysqli($server, $user, $password, $corpusdb);

if (!$corpus_con) {
    echo "failed to connect to database!";
}



$languages = [];
$docid = mysqli_real_escape_string($corpus_con, $docid);


$query = "SELECT Language FROM Languages WHERE QID = '.$docid.';";
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
