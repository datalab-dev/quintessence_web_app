<?php
require 'vendor/autoload.php';

if ($_GET) {
    $term = $_GET['term'];
} else {
    $term = $argv[1];
}

$con = new MongoDB\Client("mongodb://localhost:27017");
$db = $con->test;
$collection = $db->{'terms.frequencies'};
$cursor = $collection->find(
    [
        '_id' => $term
    ],
    [
        'projection' => [
            '_id' => 0,
            'decades' => 1,
        ]
    ]
);
$res = $cursor->toArray()[0]['decades'];

$relFreqs = [];
$rawFreqs = [];
foreach ($res as $freqs) {
    array_push($rawFreqs, $freqs['freq']);
    array_push($relFreqs, $freqs['relFreq']);
}

$result = array(
    'relFreqs' => $relFreqs,
    'rawFreqs' => $rawFreqs
);
echo json_encode($result);
?>
