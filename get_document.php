<?php
require 'vendor/autoload.php';

if ($_GET) {
    $qid = (int)$_GET['qid'];
    $type = $_GET['type'];
    $truncated = (bool)$_GET['truncated'];
} else {
    $qid = (int)$argv[1];
    $type = $argv[2];
    $truncated = (bool)$argv[3];
}

if ($truncated) {
    $collectionName = 'docs.truncated';
} else {
    $collectionName = 'docs';
}

$con = new MongoDB\Client("mongodb://localhost:27017");
$db = $con->test;
$collection = $db->{$collectionName};
$cursor = $collection->find(
    [
        '_id' => $qid
    ],
    [
        'projection' => [
            '_id' => 0,
            $type => 1
        ]
    ]
);
$response = $cursor->toArray()[0][$type];

echo json_encode($response);
?>
