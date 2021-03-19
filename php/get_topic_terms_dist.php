<?php
/**
get_top_topics_terms_dist

Given term, return topic distribution

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
$collection = $db->{'topics.termstopicsdist'};
$document = $collection->findOne(
    ['_id' => $term], 
    ['projection' => [ "_id" => 0 ]
    ]
);

echo json_encode($document["topic_dist"]);
?>
