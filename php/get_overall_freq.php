<?php
/**
get_overall_freq.php

Return total word counts and document counts for each year.

{
    "word_count": [
	{year: count},
    ],
    "doc_count": [
	{year: count},
    ]
}

authors:    Arthur Koehl, Chandni Nagda
 */

require 'vendor/autoload.php';
require 'config.php';


$db = getMongoCon();
$collection = $db->{'frequencies.corpus'};
$res = $collection->findOne(
    [],
    ['projection' => [ '_id' => 0]]
);

echo json_encode($res);
?>
