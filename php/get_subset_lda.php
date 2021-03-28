<?php
/** 
get_subset_lda.php

Return list of all docs that match subset critera
As well as the new topic proportions

GET Request string looks like:
./php/get_subset_lda.php?proportion=true&dates='1470','1700'&keywords='Clothing and dress','Early works to 1800.','Legal status, laws, etc.'&authors='elizabeth i queen england','clark samuel'&locations='london','oxford'

each item is enclosed in single quotes and separated by commas
dates is starting year and end year

Return is 
{
    "qids": [ ],
    "proportions": [ ]
}

authors: Arthur Koehl, Chandni Nagda
 */
require 'vendor/autoload.php';
require 'config.php';


/* returns a subset of qids given numeric bounds and metadata field
 * bounds should be passed in as comma separated string
 * if string is empty returns empty array */
function subsetDates($collection, $boundsString) {
    if ($boundsString == '') {
	return [];
    }

    $bounds = explode(',', str_replace('\'', '', $boundsString));
    $bounds = array_map('intval', $bounds);

    $cursor = $collection->aggregate(
	[[
	// add new field 'dates' that is numeric of date string
	    '$addFields' => [
		'year' => [
		    '$convert'=> [ 
		        "input"=> '$Date',
			"to"=> "int",
			"onError"=> 0
                    ]
               ]
	    ]
	],
	// return ids that fall within the bounds
	['$match' => [
	    'year' => ['$gte' => $bounds[0], '$lte' => $bounds[1]]
	]
	],
	['$project' => [
	    '_id' => 1,
	]
	]]
    );

    $subset = [];
    foreach ($cursor as $doc) {
	$subset[] = $doc['_id'];
    }

    return $subset;
}


/* given an array of match arrays return the intersection */
function intersectMatches($matches) {
    $nquery = count(array_filter($matches)); // nonempty arrays
    $merged = array_merge(...$matches);
    $counts = array_count_values($merged);
    $docs = array_filter($counts, function($count) use($nquery){
	return $count >= $nquery;
    });
    $docs = array_keys($docs);

    return $docs;
}


/* calculate topic proportions */
function getTopicProportions($collection, $docs) {
    $cursor = $collection->aggregate(
	[
	    [
		'$match' => ['_id' => ['$in' => $docs]]
	    ],
	    [
		// ALWAYS MAKE SURE LOOKUP COLLECTION IS INDEXED ON foreignField!
		'$lookup' => [
		    'from' => 'frequencies.docs',
		    'localField' => '_id',
		    'foreignField' => '_id',
		    'as' => 'counts'
		]
	    ],
	    [
		'$unwind' => [
		    'path' => '$topic_distribution', 
		    'includeArrayIndex' => "topicId"
		]
	    ],
	    [
		'$replaceRoot' => ['newRoot' => [
		    '$mergeObjects' => [
			['$arrayElemAt' => ['$counts', 0]],
			'$$ROOT']]
		]
	    ],
	    [
		'$project' => [
		    'topicId' => 1,
		    'topic_distribution' => 1,
		    'word_count_preprocessed' => 1,
		    'freq' => ['$multiply' => [
			'$topic_distribution',
			'$word_count_preprocessed']
		    ]
		]
	    ],
	    [
		'$group' => [
		    '_id' => '$topicId',
		    'topicFreq' => ['$sum' => '$freq'],
		]
	    ]
	]
    );
    $res = $cursor->toArray();

    $sum = 0;
    $topicFreqs = [];
    $ntopics = 0;
    foreach ($res as $freq) {
	$id = $freq["_id"];
	$tf = $freq["topicFreq"];
	$topicFreqs[$id] = $tf;
	$sum = $sum + $tf;
	$ntopics = $ntopics + 1;
    }

    $topicProportions = [];
    $topicProportions = array_fill(0, $ntopics, 0.0);
    foreach ($topicFreqs as $topicId => $topicFreq) {
	$topicProportions[intval($topicId)] = ($topicFreq) / $sum;
    }

    return $topicProportions;
}


if ($_GET) {
    $datesString = $_GET['dates'];
    $keywordsString = $_GET['keywords'];
    $locationsString = $_GET['locations'];
    $authorsString = $_GET['authors'];
    $proportion = (bool)$_GET['proportion']; // set true to calculate proportion
} else {
    $datesString = "'1490','1700'";
    $keywordsString = "'description and travel', 'early works to 1800'";
    $locationsString = "'london','paris'";
    $authorsString = "'charles i king england', 'charles ii king england'";
    $proportion = True;
}

$db = getMongoCon();
$collection = $db->{'docs.meta'};

/* get qids of subset */
$matches = [];
$matches[0] = [];
$matches[0] = subsetDates($collection, $datesString);

// authors
$collection = $db->{'topics.authors'};
$authorsString = str_replace("'", "", $authorsString);
$authors = explode(',', $authorsString);
$authors=array_map('trim',$authors);
$matches[1] = [];
$cursor = $collection->find(
    ['Author' =>  ['$in' => $authors]],
    ['projection' => ["_id"=> 0, "docId"=> 1 ]] 
);
$results = $cursor->toArray();
foreach ($results as $res) {
    $matches[1][] = $res["docId"];
}

// locations
$collection = $db->{'topics.locations'};
$locationsString = str_replace("'", "", $locationsString);
$locations = explode(',', $locationsString);
$locations=array_map('trim',$locations);
$matches[2] = [];
$cursor = $collection->find(
    ['Location' =>  ['$in' => $locations]],
    ['projection' => ["_id"=> 0, "docId"=> 1 ]] 
);
$results = $cursor->toArray();
foreach ($results as $res) {
    $matches[2][] = $res["docId"];
}

// keywords
$collection = $db->{'topics.keywords'};
$keywordsString = str_replace("'", "", $keywordsString);
$keywords = explode(',', $keywordsString);
$keywords=array_map('trim',$keywords);
$matches[3] = [];
$cursor = $collection->find(
    ['Keywords' =>  ['$in' => $keywords]],
    ['projection' => ["_id"=> 0, "docId"=> 1 ]] 
);
$results = $cursor->toArray();
foreach ($results as $res) {
    $matches[3][] = $res["docId"];
}



/*
echo ($datesString."\n");
echo count($matches[0]);
echo "\n\n";

echo (json_encode($authors)."\n");
echo count($matches[1]);
echo "\n\n";

echo (json_encode($locations)."\n");
echo count($matches[2]);
echo "\n\n";

echo (json_encode($keywords)."\n");
echo count($matches[3]);
echo "\n";
 */

$docs = intersectMatches($matches);

/* get topic proportions */
$proportions = [];
$collection = $db->{'topics.doctopics'};
if (!empty($docs) && $proportion)
    $proportions = getTopicProportions($collection, $docs);

$result = array(
    'qids' => $docs,
    'proportions' => $proportions
);
echo json_encode($result);
?>
