<?php
require 'vendor/autoload.php';
require 'config.php';

$db = getMongoCon();
$collection = $db->topics;
$cursor = $collection->find(
    [],
    [
        'projection' => [
            '_id' => 0
        ]
    ]
);
$response = $cursor->toArray();

echo json_encode($response);
?>
