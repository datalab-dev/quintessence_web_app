<?php
/**
get_timeseries_terms.php

Return list of all the terms that have timeseries data


authors:    Arthur Koehl, Chandni Nagda
 */

require 'vendor/autoload.php';
require 'config.php';

$db = getMongoCon();
$collection = $db->{'terms.timeseries'};
$cursor = $collection->find(
    [], 
    ['projection' => [
	'_id' => 1,
    ] 
    ],
);
$results = $cursor->toArray();
$terms = [];
foreach ($results as $res) {
    $terms[] = $res["_id"];
}

echo json_encode($terms);
?>
