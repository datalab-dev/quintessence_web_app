<?php
/**
get_terms.php

Return list of all the terms that can be plotted based on frequency.

authors:    Arthur Koehl, Chandni Nagda
 */

require 'vendor/autoload.php';
require 'config.php';

$db = getMongoCon();
$collection = $db->{'frequencies.terms'};
$cursor = $collection->find(
    [], 
    ['projection' => [
	'_id' => 0,
	'freq' => 0,
    ] 
    ],
);
$results = $cursor->toArray();

$terms = array();
foreach ($results as $res) {
    $terms[] = $res["term"];
}

echo json_encode($terms);
?>
