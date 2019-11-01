<?php

$docid = $_POST['docid'];

require_once("config.php");

// open mysqli conneciton
$corpus_con = new mysqli($server, $user, $password, $corpusdb);

if (!$corpus_con) {
    echo "failed to connect to database!";
}



$fileid = "";
$docid = mysqli_real_escape_string($corpus_con, $docid);


$query = "SELECT File_ID FROM Metadata WHERE QID = '".$docid."';";
if ($result = $corpus_con->query($query)) {
    while ($row = $result->fetch_row()) {
        $fileid = $row[0];
    }
} // if query succesful

echo ($fileid);

mysqli_close($corpus_con);

?>
