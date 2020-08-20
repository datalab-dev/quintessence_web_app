<?php
require 'vendor/autoload.php';
require 'config.php';

$db = getMongoCon();
$collection = $db->{'terms.timeseries'};
$cursor = $collection->find([], ['projection' => ['_id' => 1]]);
$res = $cursor->toArray();

$terms = [];
foreach ($res as $term)
    array_push($terms, $term['_id']);

echo json_encode($terms);
?>
