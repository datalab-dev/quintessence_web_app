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


/* returns a subset of qids given string which appears in metadata field
 * if string is empty returns empty array */
function subsetString($collection, $field, $string) {
    if ($string == '') {
	return [];
    }

    $searchTerms = explode(',', str_replace('\'', '', $string));
    $regexStrings = [];
    foreach ($searchTerms as $searchTerm) {
	$regexStrings[] = [
	    $field => ['$regex' => new MongoDB\BSON\Regex(".*{$searchTerm}.*")]
	];
    }

    $cursor = $collection->find(
	['$or' => $regexStrings],
	['projection' => ['_id' => 1]]
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
		    'foreignField' => 'docId',
		    'as' => 'counts'
		]
	    ],
	    [
		'$unwind' => [
		    'path' => '$topics', 
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
		    'freq' => ['$multiply' => [
			'$topics',
			'$word_count_raw']
		    ]
		]
	    ],
	    [
		'$group' => [
		    '_id' => '$topicId',
		    'topicFreq' => ['$sum' => '$freq']
		]
	    ]
	]
    );
    $res = $cursor->toArray();

    foreach ($res as $freq) {
	$topicFreqs[] = $freq['topicFreq'];
    }
    $sum = array_sum($topicFreqs);

    $topicProportions = [];
    foreach ($topicFreqs as $topicFreq) {
	$topicProportions[] = ($topicFreq) / $sum;
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
    $keywordsString = "'Description and travel', 'Early works to 1800'";
    $locationsString = "";
    $authorsString = "";
    $proportion = True;
}

$db = getMongoCon();
$collection = $db->{'docs.meta'};

/* get qids of subset */
$matches = [];
$matches[] = subsetDates($collection, $datesString);
$matches[] = subsetString($collection, 'Keywords', $keywordsString);
$matches[] = subsetString($collection, 'Location', $locationsString);
$matches[] = subsetString($collection, 'Author', $authorsString);
$docs = intersectMatches($matches);

/* get topic proportions */
$proportions = [];
$collection = $db->{'docs.topics'};
if (!empty($docs) && $proportion)
    $proportions = getTopicProportions($collection, $docs);

$result = array(
    'qids' => $docs,
    'proportions' => $proportions
);
echo json_encode($result);
?>
