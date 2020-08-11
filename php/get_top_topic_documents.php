<?php
require 'vendor/autoload.php';
require 'config.php';

if ($_GET) {
    $topicId = (int)$_GET['topicId'];
} else {
    $topicId = (int)$argv[1];
}

$db = getMongoCon();
$collection = $db->{'topics'};
$cursor = $collection->find(['_id' => $topicId]);
$response = $cursor->toArray()[0];

echo json_encode($response['topDocs']);
?>