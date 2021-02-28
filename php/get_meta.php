<?php
/**
get_meta.php

Given document id return metadata

args (either GET parameters or command line):
    qid -- integer

authors:     Arthur Koehl, Chandni Nagda
 */

require 'vendor/autoload.php';
require 'config.php';

if ($_GET) {
    $qid = (int)$_GET['qid'];
} else {
    $qid = (int)$argv[1];
}

$db = getMongoCon();
$collection = $db->{'docs.meta'};
$cursor = $collection->find(
    ['_id' => $qid],
    ['projection' => ['_id' => 0]]
);
$response = $cursor->toArray()[0];

echo json_encode($response);
?>
