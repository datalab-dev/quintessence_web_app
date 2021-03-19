<?php
/**
get_topics.php

Return list of all the topics

authors:    Arthur Koehl
 */

require 'vendor/autoload.php';
require 'config.php';

$db = getMongoCon();
$collection = $db->{'topics.coordinates'};
$cursor = $collection->find(
    [], 
    ['projection' => [
	'_id' => 1,
    ] 
    ],
);
$results = $cursor->toArray();
$topics = [];
foreach ($results as $res) {
    $topics[] = $res["_id"];
}

echo json_encode($topics);
?>
