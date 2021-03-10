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
