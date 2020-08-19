<?php
require 'vendor/autoload.php';
require 'config.php';


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
                '$lookup' => [
                    'from' => 'docs.metadata',
                    'localField' => '_id',
                    'foreignField' => '_id',
                    'as' => 'meta'
                ]
            ],
            [
                '$unwind' => ['path' => '$topics']
            ],
            [
                '$replaceRoot' => ['newRoot' => [
                    '$mergeObjects' => [
                        ['$arrayElemAt' => ['$meta', 0]],
                        '$$ROOT']]
                    ]
            ],
            [
                '$project' => [
                    'topicId' => '$topics.topicId',
                    'freq' => ['$multiply' => [
                        '$topics.probability',
                        '$wordCount']
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
    $datesString = "'1490','1600'";
    $keywordsString = "'Description and travel', 'Early works to 1800'";
    $locationsString = "";
    $authorsString = "";
    $proportion = True;
}

$db = getMongoCon();
$collection = $db->{'docs.metadata'};

/* get qids of subset */
$matches = [];
$matches[] = subsetNumeric($collection, 'date', $datesString);
$matches[] = subsetString($collection, 'keywords', $keywordsString);
$matches[] = subsetString($collection, 'location', $locationsString);
$matches[] = subsetString($collection, 'author', $authorsString);
$docs = intersectMatches($matches);

/* get topic proportions */
$collection = $db->{'docs.topics'};
$proportions = [];
if (!empty($docs) && $proportion)
    $proportions = getTopicProportions($collection, $docs);

$result = array(
    'qids' => $docs,
    'proportions' => $proportions
);
echo json_encode($result);
?>
