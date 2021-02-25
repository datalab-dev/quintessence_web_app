<?php
/**
get_truncated_document.php

Given document id, return truncated version of the doucment text.

args (either GET parameters or command line):
    qid -- integer (0 - ~60k)

authors:    Arthur Koehl, Chandni Nagda
 */

require 'vendor/autoload.php';
require 'config.php';

if ($_GET) {
    $qid = (int)$_GET['qid'];
} else {
    $qid = (int)$argv[1];
}

$db = getMongoCon();
$collection = $db->{'docs.truncated'};
$cursor = $collection->find(
    [
        '_id' => $qid
    ],
    [
        'projection' => [
            '_id' => 0,
            'text' => 1
        ]
    ]
);

$response = $cursor->toArray()[0];

echo json_encode($response);
?>
