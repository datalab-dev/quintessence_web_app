<?php

$topicid = $_POST['topicid'];

require_once("config.php");

// open mysqli conneciton
$model_con = new mysqli($server, $user, $password, $modelsdb);

if (!$model_con) {
    echo "failed to connect to database!";
}

// given topic id get the document column from the database
// kind of awkward that client needs to know the column names ... 
// means we can't use prepared statements
$topicid = mysqli_real_escape_string($model_con, $topicid);
$query = "SELECT V".$topicid.",QID FROM doc_topics";
$docs = [];

if ($result = $model_con->query($query, MYSQLI_USE_RESULT)) {
    while ($row = $result->fetch_row()) {
        $docs[] = array("QID" => $row[1], "Score" => $row[0]);
    }
} // if query succesful

if (empty($docs))
    $results = "";
else {
    $results = json_encode($docs);
}

echo ($results);

mysqli_close($model_con);

?>
