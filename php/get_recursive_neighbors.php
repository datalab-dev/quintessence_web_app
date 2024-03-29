<?php
/**
get_recursive_neighbors.php

Given term, and model return nearest topn neighbors 
for each neighbor get it's distance with the other neighbors

args (either GET parameters or command line):
    term      -- string
    modeltype -- string
    modelname -- string
    topn      --  int

authors:    Arthur Koehl
 */

require 'vendor/autoload.php';
require 'config.php';

function get_neighbors($term, $modelname, $modeltype, $db, $topn) {

    $collection = $db->{'terms.neighbors'};
    $res = $collection->findOne(
	[
	    '_id' => $term
	]
    );

    $terms = array();
    $scores = array();
    $freqs = array();

    # Get list of neighbors
    if ($modeltype == "full") {
	$terms = array_slice($res[$modeltype]["terms"], 0, $topn);
	$scores = array_slice($res[$modeltype]["scores"], 0, $topn);
	$freqs = array_slice($res[$modeltype]["freqs"], 0, $topn);
        $freq = $res[$modeltype]["freq"];
    }
    else {
	$terms = array_slice($res[$modeltype][$modelname]["terms"], 0, $topn);
	$scores = array_slice($res[$modeltype][$modelname]["scores"], 0, $topn);
	$freqs = array_slice($res[$modeltype][$modelname]["freqs"], 0, $topn);
        $freq = $res[$modeltype][$modelname]["freq"];
    }


    return(
	array("terms" => $terms, "scores" => $scores, "freqs" => $freqs, 
	"freq" => $freq)
    );
}

function get_freq($term, $db) {
    $collection = $db->{'terms.neighbors'};
    $res = $collection->findOne(
	[
	    '_id' => $term
	]
    );
    return ($res["full"]["freq"]);
}

$db = getMongoCon();

if ($_GET) {
    $term = $_GET['term'];
    $modeltype = $_GET['modeltype'];
    $modelname = $_GET['modelname'];
    $topn = $_GET['topn'];
} else {
    $term = $argv[1];
    $modeltype = $argv[2];
    $modelname = $argv[3];
    $topn = 10;
}

$all_neighbors = array();
$neighbors = get_neighbors($term, $modelname, $modeltype, $db, $topn);
$all_neighbors[$term] = $neighbors;
$all_neighbors[$term]["freq"] = get_freq($term, $db);

# foreach neighbor get similarity to the other neighbors
foreach ($neighbors["terms"] as $n) {
    $all_neighbors[$n] = get_neighbors($n, $modelname, $modeltype, $db, $topn);
    $all_neighbors[$term]["freq"] = get_freq($term, $db);
}

echo json_encode($all_neighbors);
?>
