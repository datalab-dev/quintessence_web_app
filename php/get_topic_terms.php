<?php

$topicid = $_POST['topicid'];

require_once("config.php");

// open mysqli conneciton
$model_con = new mysqli($server, $user, $password, $modelsdb);

if (!$model_con) {
    echo "failed to connect to database!";
}

// given topic id get the topic column from the database terms topic table
// kind of awkward that client needs to know the column names ... 
// means we can't use prepared statements
$topicid = "V".mysqli_real_escape_string($model_con, $topicid);
$query = "SELECT word,".$topicid." FROM topic_terms";
$docs = [];

if ($result = $model_con->query($query, MYSQLI_USE_RESULT)) {
    while ($row = $result->fetch_row()) {
        $docs[] = array("Term" => $row[0], "Score" => $row[1]);
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
