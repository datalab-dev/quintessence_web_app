<?php
require 'vendor/autoload.php';

if ($_GET) {
    $topicId = (int)$_GET['topicId'];
} else {
    $topicId = (int)$argv[1];
}

$con = new MongoDB\Client("mongodb://localhost:27017");
$db = $con->test;
$collection = $db->{'topics'};
$cursor = $collection->find(['_id' => $topicId]);
$response = $cursor->toArray()[0];

echo json_encode($response['topDocs']);
?>
