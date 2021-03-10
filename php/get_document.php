<?php
/**
get_document.php

Given document id and type, return full document text.

args (either GET parameters or command line):
    qid  -- integer (0 - ~60k) 
    type -- string (lemma, std, pos, text)

authors:    Arthur Koehl, Chandni Nagda
 */ 

require 'vendor/autoload.php';
require 'config.php';

if ($_GET) {
    $qid = (int)$_GET['qid'];
    $type = $_GET['type'];
} else {
    $qid = (int)$argv[1];
    $type = $argv[2];
}

$collectionName = 'docs' . '.' . $type;
$db = getMongoCon();
$collection = $db->{$collectionName};
$cursor = $collection->find(
    [
	'_id' => $qid
    ],
    [
	'projection' => [
	    '_id' => 0,
	    $type => 1
	]
    ]
);

$response = $cursor->toArray()[0];

echo json_encode($response);
?>
