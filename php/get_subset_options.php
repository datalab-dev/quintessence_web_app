<?php
/**
get_subset_options.php

Returns list of all unique authors, locations, and keywords from the metadata collection.

authors:    Arthur Koehl, Chandni Nagda
 */

require 'vendor/autoload.php';
require 'config.php';


$db = getMongoCon();

/* unique authors, locations, and keywords sorted*/
//authors
$collection = $db->{'topics.authors'};
$authors = [];
$cursor = $collection->aggregate(
    [
	[
	    '$group' => [
	        '_id'=> '$Author',
	        'count'=> [
	    	'$sum' => 1,
	        ]	
	    ]
	],
	[
	    '$sort' => [
		'count'=> -1,
	    ]
	]
    ]
);
foreach ($cursor as $doc) {
    $authors[] = $doc["_id"];
}


//keywords
$collection = $db->{'topics.keywords'};
$keywords = [];
$cursor = $collection->aggregate(
    [
	[
	    '$group' => [
	        '_id'=> '$Keywords',
	        'count'=> [
	    	'$sum' => 1,
	        ]	
	    ]
	],
	[
	    '$sort' => [
		'count'=> -1,
	    ]
	]
    ]
);
foreach ($cursor as $doc) {
    $keywords[] = $doc["_id"];
}



//locations
$collection = $db->{'topics.locations'};
$locations = [];
$cursor = $collection->aggregate(
    [
	[
	    '$group' => [
	        '_id'=> '$Location',
	        'count'=> [
	    	'$sum' => 1,
	        ]	
	    ]
	],
	[
	    '$sort' => [
		'count'=> -1,
	    ]
	]
    ]
);
foreach ($cursor as $doc) {
    $locations[] = $doc["_id"];
}


$result = array(
    'authors'=> $authors,
    'locations' => $locations,
    'keywords' => $keywords,
);
echo json_encode($result);
?>
