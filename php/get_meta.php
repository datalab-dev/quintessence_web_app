<?php
require 'vendor/autoload.php';

if ($_GET) {
    $qid = (int)$_GET['qid'];
} else {
    $qid = (int)$argv[1];
}

$db = getMongoCon();
$collection = $db->{'docs.metadata'};
$cursor = $collection->find(
    ['_id' => $qid],
    ['projection' => ['_id' => 0]]
);
$response = $cursor->toArray()[0];

echo json_encode($response);
?>
