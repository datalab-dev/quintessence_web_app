<?php
// note get rid of all commas and quotes in mysql corpus
// dates = 'year1','year2'
// keywords = 'kw1','kw2','kw3' ...
// locations = 'l1','l2','l3','l4' ...
// authors = 'a1','a2'
//

$dates_string = $_POST['dates'];
$keywords_string = $_POST['keywords'];
$locations_string = $_POST['locations'];
$authors_string = $_POST['authors'];

//$dates_string = "'1490','1600'";
//$keywords_string = "'Description and travel', 'Early works to 1800'";
//$locations_string = "'amsterdam'";
//$authors_string = "";

require_once("config.php");

// open mysqli conneciton
$corpus_con = new mysqli($server, $user, $password, $corpusdb);

if (!$corpus_con) {
    echo "failed to connect to database!";
}



$dates = explode(',', $dates_string);
$date0 = $dates[0];
$date1 = $dates[1];

$matches = [];
$nquery = 0;

// DATES
if ($dates_string != "") {
    $query = "SELECT QID FROM Metadata WHERE Date between $date0 and $date1;";
    //echo $query."\n";
    if ($result = $corpus_con->query($query)) {
	while ($row = $result->fetch_row()) {
	    $matches[] = $row[0];
	}
    }
    $nquery = $nquery + 1;
 //   echo ("dates: ". count($matches)."\n");
}

// KEYWORDS
$uniq = [];
if ($keywords_string != "") {
    $query = "SELECT QID FROM Keywords WHERE Keyword in ($keywords_string);";
    //echo $query."\n";
    if ($result = $corpus_con->query($query)) {
	while ($row = $result->fetch_row()) {
	    $uniq[] = $row[0];
	}
    }
    $nquery = $nquery + 1;
    $uniq = array_unique($uniq);
  //  echo ("keywords: " .count($uniq)."\n");
    $matches = array_merge($matches, $uniq);
}

// AUTHORS
$uniq = [];
if ($authors_string != "") {
    $query = "SELECT QID FROM Authors WHERE Author in ($authors_string);";
    //echo $query."\n";
    if ($result = $corpus_con->query($query)) {
	while ($row = $result->fetch_row()) {
	    $uniq[] = $row[0];
	}
    }
    $nquery = $nquery + 1;
    $uniq = array_unique($uniq);
    //echo ("authors: " .count($uniq)."\n");
    $matches = array_merge($matches, $uniq);
}

// LOCATIONS
$uniq = [];
if ($locations_string != "") {
    $query = "SELECT QID FROM Metadata WHERE Location in ($locations_string);";
    //echo $query."\n";
    if ($result = $corpus_con->query($query)) {
	while ($row = $result->fetch_row()) {
	    $uniq[] = $row[0];
	}
    }
    $nquery = $nquery + 1;
    $uniq = array_unique($uniq);
    //echo ("locations: " .count($uniq)."\n");
    $matches = array_merge($matches, $uniq);
}

$counts = array_count_values($matches);
$combined = [];
foreach ($counts as $key => $value) {
    if ($value >= $nquery) {
	$combined[] = $key;
    }
}

if (empty($combined))
    $results = "";
else {
    $results = json_encode($combined);
}

//echo ("nquery: ".$nquery)."\n";
//echo ("max count: " .max($counts)."\n");
//echo ("total results: " .count($combined)."\n");
echo ($results);

mysqli_close($corpus_con);

?>
