<?php
require 'vendor/autoload.php';


/* returns a subset of qids given numeric bounds and metadata field
 * bounds should be passed in as comma separated string
 * if string is empty returns empty array */
function subsetNumeric($collection, $field, $boundsString) {
    if ($boundsString == '') {
        return [];
    }

    $bounds = explode(',', str_replace('\'', '', $boundsString));
    $bounds = array_map('intval', $bounds);
    $cursor = $collection->find(
        [$field => ['$gte' => $bounds[0], '$lte' => $bounds[1]]],
        ['projection' => ['_id' => 1]]
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
    $docs = array_values($docs);

    return $docs;
}


// $datesString = $_GET['dates'];
// $keywordsString = $_GET['keywords'];
// $locationsString = $_GET['locations'];
// $authorsString = $_GET['authors'];
// $proportion = (bool)$_GET['proportion']; // set true to calculate proportion

$datesString = "'1490','1600'";
$keywordsString = "'Description and travel', 'Early works to 1800'";
$locationsString = "";
$authorsString = "";
$proportion = "True";

$con = new MongoDB\Client("mongodb://localhost:27017");
$db = $con->test;
$collection = $db->{'docs.metadata'};

/* get qids of subset */
$matches = [];
$matches[] = subsetNumeric($collection, 'date', $datesString);
$matches[] = subsetString($collection, 'keywords', $keywordsString);
$matches[] = subsetString($collection, 'location', $locationsString);
$matches[] = subsetString($collection, 'author', $authorsString);
$docs = intersectMatches($matches);
// var_dump($docs);

/* get doc topics */
$collection = $db->{'topics.docs'};
$cursor = $collection->aggregate(
    [
        [
            '$unwind' => ['path' => '$docs']
        ],
        [
            '$match' => ['docs.qid' => ['$in' => $docs]]
        ],
        [
            '$group' => [
                '_id' => '$_id',
                'topicFreq' => ['$sum' => '$docs.frequency'],
            ]
        ],
        [
            '$project' => ['_id' => 0]
        ]
    ]
);
$res = $cursor->toArray();
foreach ($res as $freq) {
    $topicFreqs[] = $freq['topicFreq'];
}
$sum = array_sum($topicFreqs);

/* calculate proportions */
$topicProportions = [];
foreach ($topicFreqs as $topicFreq) {
    $topicProportions[] = ($topicFreq + 1) / $sum;
}

echo json_encode($topicProportions);
?>
