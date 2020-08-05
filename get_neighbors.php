<?php
require 'vendor/autoload.php';

if ($_GET) {
    $term = $_GET['term'];
} else {
    $term = $argv[1];
}

echo $term . "\n";

$con = new MongoDB\Client("mongodb://localhost:27017");
$db = $con->test;
$collection = $db->{'terms.neighbors'};
$cursor = $collection->find(
    [
        '_id' => $term
    ],
    [
        'projection' => [
            '_id' => 0,
            'full' => 1,
            'decades' => 1,
            'authors' => 1,
            'locations' => 1
        ]
    ]
);
$res = $cursor->toArray()[0];

echo json_encode($res);
?>
