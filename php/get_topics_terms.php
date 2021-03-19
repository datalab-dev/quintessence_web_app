<?php
/**
get_topics_terms.php

Return list of all the terms that can resize bubbles of lda plot

authors:    Arthur Koehl
 */

require 'vendor/autoload.php';
require 'config.php';

$db = getMongoCon();
$collection = $db->{'topics.termstopicsdist'};
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
