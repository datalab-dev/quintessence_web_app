<?php
/**
get_all_proportions.php

returns topic proportions for each year
{
    1470: [0.01, 0.3, 0.03 ...],
    1471: [ ],
    ...
}

authors:    Arthur Koehl, Chandni Nagda
 */ 

require 'vendor/autoload.php';
require 'config.php';

$db = getMongoCon();
$collection = $db->{'topics'};
$cursor = $collection->find(
    [
    ],
    [
	'projection' => [
	    '_id' => 0,
	    'years' => 1
	]
    ]
);

$response = $cursor->toArray();

$results = [];
$years = array_keys($response[0]["years"]);

// loop through topics
for ($i = 0; $i < count($response); $i++) {
    $props = [];
    $props = $response[$i]["years"];

    foreach ($props as $k => $v) {
        $results[$k][$i] = $v;
    }

}

echo json_encode($results);
?>
