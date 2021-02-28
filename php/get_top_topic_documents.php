<?php
/**
get_top_topic_documents.php

Given topic id, return top ten documents.

args (either GET parameters or command line):
    topicid  -- integer (0 - ntopics)

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
$cursor = $collection->find(['_id' => $topicId]);

$response = $cursor->toArray()[0];

echo json_encode($response['topDocs']);
?>
