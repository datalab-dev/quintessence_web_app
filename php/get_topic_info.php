<?php
/**
get_topic_info.php

Return data for one topic

proportions: [ ]   1470=>0.03
authors: [ ]       1470=>[author1, author2, ...]
keywords: [ ]      1470=>[keyword1, keyword2, ...]
locations: [ ]     1470=>[location1, location2 ...]
docs: [ ]          1470=>[doc1, doc2...]
topterms: [ ]
...


authors:    Arthur Koehl
 */

require 'vendor/autoload.php';
require 'config.php';

if ($_GET) {
    $topicId = (int)$_GET['topicId'];
} else {
    $topicId = (int)$argv[1];
}

$DECADES = range(1470, 1700, 10);
$DECADES = array_map('strval',$DECADES);

$db = getMongoCon();

// GET PROPORTIONS
// proportions["full"]  one entry per topic
// proportions["1470"]  one entry per topic
// proportions["1480"]  one entry per topic
// ..
$proportions = [];
$collection = $db->{'topics.proportions'};
$cursor = $collection->find(
    ['_id' => $topicId],
    [ 
	'projection' => [
	    '_id' => 0,
	    'decades' =>1,
	    'proportion' =>1,
	],
    ]
);

$results = $cursor->toArray();
foreach ($results as $res) {
    $proportions["full"][] = $res["proportion"];
    foreach ($res["decades"] as $decade => $prop) {
        if (in_array($decade, $DECADES)) {
            $proportions[$decade][] = $prop;
        }
    }
}

// GET TERMS
$db = getMongoCon();
$collection = $db->{'topics.toprelevanceterms'};
$document = $collection->findOne(
    ['_id' => $topicId], 
    ['projection' => [ "_id" => 0 ]
    ]
);
$topterms =  $document["topterms"];


// GET INFO
$authors = [];
$keywords = [];
$locations = [];
// authors["full"] = each entry is array
// authors["1470"] = each entry is array
// ..

$collection = $db->{'topics.info'};
$cursor = $collection->find(
    ['_id' => $topicId], 
    [ 
	'projection' => [
       "_id" => 0,
       "topAuthors" => 1,
       "topAuthorsScores" => 1,
       "topKeywords" => 1,
       "topKeywordsScores" => 1,
       "topLocations" => 1,
       "topLocationsScores" => 1,
        ] 
    ]
);
$results = $cursor->toArray()[0];
$authors["full"] = $results["topAuthors"];
$keywords["full"] = $results["topKeywords"];
$locations["full"] = $results["topLocations"];

// GET INFO DECADES
$collection = $db->{'topics.decades'};
$cursor = $collection->find(
    [],
);

$result = $cursor->toArray();
foreach ($result as $res) {
    $decade = $res["_id"];
    if (in_array($decade, $DECADES)) {
	$authors[$decade] = $res["topics"][$topicId]["topAuthors"];
	$keywords[$decade] = $res["topics"][$topicId]["topKeywords"];
	$locations[$decade] = $res["topics"][$topicId]["topLocations"];
    }
}


// ALL TOGETHER 
$data = [];
$data["proportions"] = $proportions;
$data["topterms"] = $topterms;
$data["authors"] = $authors;
$data["keywords"] = $keywords;
$data["locations"] = $locations;

echo json_encode($data);
?>
