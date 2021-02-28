<?php
/**
get_subset_options.php

Returns list of all unique authors, locations, and keywords from the metadata collection.

authors:    Arthur Koehl, Chandni Nagda
 */

require 'vendor/autoload.php';
require 'config.php';

$MAX = 2000;

function get_distinct($collection, $field, $count) {

    $cursor = $collection->aggregate(
	[[
	    '$match'=> [
		$field=> [
		    '$not'=> [
			'$size'=> 0
		    ]
		]
	    ]
	], 
	[
	    '$unwind' => '$'.$field,
	],
	[
	    '$group'=> [
		'_id'=> '$'.$field,
		'count'=> [
		    '$sum' => 1
		]
	    ]
	],
	[
	    '$match'=> [
		'count'=> [
		    '$gte'=> 2
		]
	    ]
	],
	[
	    '$sort'=> [
		'count'=> -1
	    ]
	],
	[ '$limit' => $count ],
	[ '$project' => [ 'id_' => 1] ],
	]);

    $results = $cursor ->toArray();
    $values = array();
    foreach ($results as $res) {
	$values[] = $res["_id"];
    }
    return ($values);
}

$db = getMongoCon();
$collection = $db->{'docs.meta'};

/* unique authors, locations, and keywords */
$authors = get_distinct($collection, "Author", $MAX);
$locations = get_distinct($collection, "Location", $MAX);
$keywords = get_distinct($collection, "Keywords", $MAX);


$result = array(
    'authors'=> $authors,
    'locations' => $locations,
    'keywords' => $keywords
);
echo json_encode($result);
?>
