<?php
require 'vendor/autoload.php';
require 'config.php';

$db = getMongoCon();
$collection = $db->{'docs.metadata'};
$cursor = $collection->aggregate(
    [
        [
            '$match' => ['decade' => ['$nin' => [0, 1470]]]
        ],
        [
            '$group' => [
                '_id' => '$decade',
                'termFreq' => ['$sum' => '$wordCount'],
                'docFreq' => ['$sum' => 1]
            ]
        ],
        [
            '$sort' => ['_id' => 1]
        ],
        [
            '$project' => ['_id' => 0]
        ]
    ]
);
$res = $cursor->toArray();

$termFreqs = [];
$docFreqs = [];
foreach ($res as $freqs) {
    $termFreqs[] = $freqs['termFreq'];
    $docFreqs[] = $freqs['docFreq'];
}

$result = array(
    'termFreqs' => $termFreqs,
    'docFreqs' => $docFreqs
);
echo json_encode($result);
?>
