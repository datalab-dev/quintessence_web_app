<?php
require 'vendor/autoload.php';
require 'config.php';

$db = getMongoCon();
$collection = $db->topics;
$cursor = $collection->find([]);
$response = $cursor->toArray();

echo json_encode($response);
?>
