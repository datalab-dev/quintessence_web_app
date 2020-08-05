<?php
require 'vendor/autoload.php';

$con = new MongoDB\Client("mongodb://localhost:27017");
$db = $con->test;
$collection = $db->{'docs.metadata'};

/* unique authors, locations, and keywords */
$authors = $collection->distinct("author");
$locations = $collection->distinct("location");
$keywords = $collection->distinct("keywords");

$result = array(
        'authors'=> $authors,
        'locations' => $locations,
        'keywords' => $keywords
    );
echo json_encode($result);
?>
