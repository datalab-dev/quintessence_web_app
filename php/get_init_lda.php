<?php
require 'vendor/autoload.php';

$con = new MongoDB\Client("mongodb://localhost:27017");
$db = $con->test;

$collection = $db->topics;
$cursor = $collection->find(
    [],
    [
        'projection' => [
            '_id' => 0
        ]
    ]
);
$response = $cursor->toArray();

echo json_encode($response);
?>
