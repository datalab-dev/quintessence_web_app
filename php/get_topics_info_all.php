<?php
/**
get_topics_info_all.php

Return data for all the topics and the full

// COORDINATES, is array of [x,y]
coordinates: [[ ]]
timeslots =  {
full: {
// each array has length = NTOPICS
// EACH META is array of [... 10 values]
    proportions: [ ]           
    authors: [[ ]]
    keywords: [[ ]]
    locations: [[ ]]
}, 
1470: {

},
...
]


authors:    Arthur Koehl
 */

require 'vendor/autoload.php';
require 'config.php';

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
    [],
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
	$proportions[$decade][] = $prop;
    }
}

// GET COORDINATES
// coordinates  one entry per topic each entry is array [x,y]
$coordinates = [];
$collection = $db->{'topics.coordinates'};
$cursor = $collection->find(
    [],
    [ 
	'projection' => [
	    '_id' => 0,
	    'x' => 1,
	    'y' => 1,
	],
    ]
);
$results = $cursor->toArray();
foreach ($results as $res) {
    $coordinates[] = array($res["x"], $res["y"]);
}

// GET INFO
$authors = [];
$keywords = [];
$locations = [];
// authors["full"] = each entry is array, one array per topic
// authors["1470"] = each entry is array, one array per topic
// ..

$collection = $db->{'topics.info'};
$cursor = $collection->find(
    [], 
    [ 
	'projection' => [
       "_id" => 1,
       "topAuthors" => 1,
       "topKeywords" => 1,
       "topLocations" => 1,
        ] 
    ]
);
$results = $cursor->toArray();
foreach ($results as $res) {
    $authors["full"][] = $res["topAuthors"];
    $locations["full"][] = $res["topLocations"];
    $keywords["full"][] = $res["topKeywords"];
}

// GET INFO DECADES

$collection = $db->{'topics.decades'};
$cursor = $collection->find(
    [],
);

$decades = [];
$result = $cursor->toArray();
foreach ($result as $res) {
    $decade = $res["_id"];
    $decades[] = $decade;
    foreach ($res["topics"] as $info) {
	$authors[$decade][] = $info["topAuthors"];
	$keywords[$decade][] = $info["topKeywords"];
	$locations[$decade][] = $info["topLocations"];
    }
}


// ALL TOGETHER 
$data = [];
$data["coordinates"] = $coordinates;
$timeslots = [];
$timeslots["full"]["proportions"] = $proportions["full"];
$timeslots["full"]["topAuthors"] = $authors["full"];
$timeslots["full"]["topKeywords"] = $keywords["full"];
$timeslots["full"]["topLocations"] = $locations["full"];

foreach ($DECADES as $d) {
    $timeslots[$d]["proportions"] = $proportions[$d];
    $timeslots[$d]["topAuthors"] = $authors[$d];
    $timeslots[$d]["topKeywords"] = $keywords[$d];
    $timeslots[$d]["topLocations"] = $locations[$d];
}
$data["timeslots"] = $timeslots;

echo json_encode($data);
?>
