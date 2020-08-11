<?php
require 'vendor/autoload.php';
require 'config.php';

if ($_GET) {
    $term = $_GET['term'];
} else {
    $term = $argv[1];
}

echo $term . "\n";

/* get neighbors to terms */
$db = getMongoCon();
$collection = $db->{'terms.neighbors'};
$cursor = $collection->find(
    [
        '_id' => $term
    ],
    [
        'projection' => [
            '_id' => 0,
            'full' => 1,
            'decades' => 1,
            'authors' => 1,
            'locations' => 1
        ]
    ]
);
$res = $cursor->toArray()[0];

/* get timeseries */
$collection = $db->{'terms.timeseries'};
$cursor = $collection->aggregate(
    [
        [
            '$match' => ['_id' => ['$in' => $res['decades'][1480]['neighbors']]]
        ],
        [
            '$project' => [
                '_id' => 0,
                'term' => '$_id',
                'timeseries' => 1
            ]
        ]
    ]
);
$timeseries = $cursor->toArray();

$res['timeseries'] = $timeseries;
echo json_encode($res);
echo "\n";
?>
