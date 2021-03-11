<?php
/**
get_topic_proportions.php

Given topic id, return yearly proportions

args (either GET parameters or command line):
    id  -- integer 0 to the total number of topics

authors:    Arthur Koehl, Chandni Nagda
 */ 

require 'vendor/autoload.php';
require 'config.php';

if ($_GET) {
    $topicId = (int)$_GET['topicId'];
} else {
    $topicId = (int)$argv[1];
}

$db = getMongoCon();
$collection = $db->{'topics'};
$cursor = $collection->find(
    [
	'_id' => $topicId
    ],
    [
	'projection' => [
	    '_id' => 0,
	    'years' => 1
	]
    ]
);

$response = $cursor->toArray()[0];

echo json_encode($response["years"]);
?>
