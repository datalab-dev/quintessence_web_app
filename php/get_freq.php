<?php
/**
get_freq.php

Given term, returns frequency and relative frequency of that term.

{
   "freq": [
       {year: count},
        ...
   ],
   "relFreq": [
       {year: count/(total wc for that year)},
       ...
   ]
}

args (either GET parameter or command line):
    term -- string

authors: Arthur Koehl, Chandni Nagda
 */

require 'vendor/autoload.php';
require 'config.php';

if ($_GET) {
    $term = $_GET['term'];
} else {
    $term = $argv[1];
}

// 1. Get freq array
$db = getMongoCon();
$collection = $db->{'frequencies.terms'};
$result = $collection->findOne(
    [
	'term' => $term
    ],
);
$freq = $result['freq'];


// 2. Get total word count per year array
$collection = $db->{'frequencies.corpus'};
$result = $collection->findOne([]);
$total_wc = $result["word_count"];


// 3. compute relative frequency
$relFreq = array();
foreach (array_keys($freq) as $year) {
    $relFreq[$year] = $freq[$year] / $total_wc[$year];
}

echo json_encode( array( 
    "freq" => $freq,
    "relFreq" => $relFreq) 
)
?>
