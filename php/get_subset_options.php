<?php
require 'vendor/autoload.php';

$db = getMongoCon();
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
