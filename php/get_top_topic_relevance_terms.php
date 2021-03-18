<?php
/**
get_top_topic_terms.php

Given topic id, return top 100 terms and their scores

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
$collection = $db->{'topics.toprelevanceterms'};
$document = $collection->findOne(
    ['_id' => $topicId], 
    ['projection' => [ "_id" => 0 ]
    ]
);

echo json_encode($document);
?>
