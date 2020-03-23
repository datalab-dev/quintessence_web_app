<?php
ini_set('memory_limit', '1024M');

$proportion = $_POST["proportion"]; // flag true to calculate proportion
$dates_string = $_POST['dates'];
$keywords_string = $_POST['keywords'];
$locations_string = $_POST['locations'];
$authors_string = $_POST['authors'];

//$proportion = "True";
//$dates_string = "'1490','1600'";
//$keywords_string = "'Description and travel', 'Early works to 1800'";
//$locations_string = "";
//$authors_string = "";

require_once("config.php");

// open mysqli conneciton
$corpus_con = getCorpusCon();
$models_con = getModelsCon();



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
$qids = [];
foreach ($counts as $key => $value) {
    if ($value >= $nquery) {
	$qids[] = $key;
    }
}

$proportions = [];
if (!empty($qids) && $proportion) {

    // convert $ids to qids string "'1400','2200'";
    $qids_string = "'" .  implode($qids, "','") . "'";

    // get doc topics
    $ndocs = 0;
    $ntopics = 0;
    $dts = [];
    $modeled_qids = [];
    $query = "SELECT * FROM doc_topics Where QID in ($qids_string);";
    if ($result = $models_con->query($query)) {
	while ($row = $result->fetch_row()) {
            $ndocs = $ndocs + 1;
	    $dt = [];
	    $ntopics = 0;
	    foreach ($row as $val) {
		if ($val <= 1) {
		    $ntopics = $ntopics + 1;
		    $dt[] = $val;
		} else {
                  $modeled_qids[] = $val;
                }
	    }
	    array_push($dts, $dt);
	}
    }

    $modeled_qids_string = "'" . implode($modeled_qids, "','") . "'";


    // get doc lens
    $dls = [];
    $query = "SELECT Word_Count FROM Metadata Where QID in ($modeled_qids_string);";
    if ($result = $corpus_con->query($query)) {
	while ($row = $result->fetch_row()) {
	    $dls[] = $row[0];
	}
    }

    // get topic proportions
    // tf = colsums(dt * dl)
    // tp = tf / sum(tf)
    $tf = [];
    for ($i = 0; $i < $ntopics; $i++){
        $tf[$i] = 0;
    }
    for ($i = 0; $i < count($dls); $i++) {
        for ($j = 0; $j < $ntopics; $j++) {
            $val = $dls[$i] * $dts[$i][$j];
            $tf[$j] = $tf[$j] + $val;
        }
    }
    $tp = [];
    $sum = array_sum($tf);
    for ($i = 0; $i < count($tf); $i++){
	$tp[] = $tf[$i] / $sum;
    }
}


$combined = [];
$combined["qids"] = $qids;
$combined["proportions"] = $tp;
if (empty($combined))
    $results = "";
else {
    $results = json_encode($combined);
}

echo ($results);

mysqli_close($corpus_con);

?>
