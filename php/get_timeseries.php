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
$collection = $db->{'terms.timeseries'};
$cursor = $collection->find(['_id' => $term]);
$response = $cursor->toArray()[0];

echo json_encode($response['timeseries']);
?>
