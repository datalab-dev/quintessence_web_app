<?php
/**
get_neighbors.php

Given term return neighbors for each model

args (either GET parameters or command line):
    term  -- string

authors:    Arthur Koehl, Chandni Nagda
 */

require 'vendor/autoload.php';
require 'config.php';

if ($_GET) {
    $term = $_GET['term'];
} else {
    $term = $argv[1];
}
$db = getMongoCon();

$collection = $db->{'terms.neighbors'};
$res = $collection->findOne(
    [
	'_id' => $term
    ]
);
echo json_encode($res);
?>
