<?php
/**
get_embeddings_terms.php

Return list of all the terms that were modeled in the word embedding

// need to increase memory size above 134 mb because number of terms is quite large

authors:    Arthur Koehl, Chandni Nagda
 */

require 'vendor/autoload.php';
require 'config.php';
ini_set('memory_limit','256M');

$db = getMongoCon();
$collection = $db->{'terms.neighbors'};
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
