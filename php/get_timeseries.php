<?php
/**
get_timeseries.php

Given term, returns timeseries data for that term

args (either GET parameter or command line):
    term -- string


{
    decades: {
    1470:  {
        similarity: 0.76,
	neighbors: ["fortune", "wealth", ...],
	scores: [0.76, 0.86, 0.5...]
    },
    ...
    }
}

authors: Arthur Koehl, Chandni Nagda
 */

require 'vendor/autoload.php';
require 'config.php';

if ($_GET) {
    $term = $_GET['term'];
} else {
    $term = $argv[1];
}

// 1. Get timeseries
$db = getMongoCon();
$collection = $db->{'terms.timeseries'};
$result = $collection->findOne(
    [
	'_id' => $term
    ],
    [
	'projection' => [
	    '_id' => 0,
	]
    ]
);

$timeseries = $result["timeseries"];

// 2. For each decade get nearest neighbors as well
$collection = $db->{'terms.neighbors'};
$result = $collection->findOne(
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

$decade_nns = $result['decades'];

$timeseries_and_nn = [];
foreach ($timeseries as $decade => $similarity) {
    $timeseries_and_nn[$decade]["similarity"] = $similarity;
    $timeseries_and_nn[$decade]["terms"] = $decade_nns[$decade]["terms"];
    $timeseries_and_nn[$decade]["scores"] = $decade_nns[$decade]["scores"];
}

echo json_encode($timeseries_and_nn);
?>
