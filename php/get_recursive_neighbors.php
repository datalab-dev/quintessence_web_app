<?php
/**
get_recursive_neighbors.php

Given term, and model return nearest topn neighbors 
for each neighbor, also return its topn neighbors that are in the 
neighbors list of the query term 

args (either GET parameters or command line):
    term  -- string
    model -- string
    topn  --  int

authors:    Arthur Koehl
 */

require 'vendor/autoload.php';
require 'config.php';

if ($_GET) {
    $term = $_GET['term'];
    $model = $_GET['model'];
    $topn = $_GET['topn'];
} else {
    $term = $argv[1];
    $model = $argv[2];
    $topn = 10;
}
$db = getMongoCon();

$collection = $db->{'terms.neighbors'};
$res = $collection->findOne(
    [
	'_id' => $term:

    ]
);
echo json_encode($res);
?>
