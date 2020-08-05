<?php
require 'vendor/autoload.php';

if ($_GET) {
    $qid = (int)$_GET['qid'];
} else {
    $qid = (int)$argv[1];
}

$con = new MongoDB\Client("mongodb://localhost:27017");
$db = $con->test;
$collection = $db->{'docs.metadata'};
$cursor = $collection->find(
    ['_id' => $qid],
    ['projection' => ['_id' => 0]]
);
$response = $cursor->toArray()[0];

echo json_encode($response);
?>
