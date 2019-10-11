<?php

$docid = $_POST['docid'];

require_once("config.php");

// open mysqli conneciton
$corpus_con = new mysqli($server, $user, $password, $corpusdb);

if (!$corpus_con) {
    echo "failed to connect to database!";
}



$wc = -1;
$docid = mysqli_real_escape_string($corpus_con, $docid);


$query = "SELECT Word_Count FROM Metadata WHERE QID = '".$docid."';";
if ($result = $corpus_con->query($query)) {
    while ($row = $result->fetch_row()) {
	$wc = $row[0];
    }
} // if query succesful


if ($wc == -1)
    $results = "";
else {
    $results = json_encode($wc);
}

echo ($results);

mysqli_close($corpus_con);

?>
