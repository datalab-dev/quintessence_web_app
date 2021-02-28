<?php
/**
get_init_lda.php

Returns information about each topic for the ldapca plot. 
{
    [
    {topicId, x,y, porportion, topAuthors, topKeywords, topLocations},
    ....
    ]
}

authors:    Arthur Koehl, Chandni Nagda
 */

require 'vendor/autoload.php';
require 'config.php';

$db = getMongoCon();
$collection = $db->topics;
$cursor = $collection->find(
    [],
    ['projection' => [
	'_id' => 0,
	'topicId' => 1,
	'x' => 1,
	'y' => 1,
	'proportion' => 1,
	'topAuthors' => 1,
	'topLocations' => 1,
	'topKeywords' => 1
    ]
    ] ,
);
$response = $cursor->toArray();
echo json_encode($response);
?>
