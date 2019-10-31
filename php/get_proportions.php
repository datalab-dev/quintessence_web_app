<?php
// for each qid: get doc_length and doc topics

require_once("config.php");

//$qids_string = "'1400','22000'";
$qids_string = $_POST['qids'];

// open mysqli connections
$models_con = new mysqli($server, $user, $password, $modelsdb);
$corpus_con = new mysqli($server, $user, $password, $corpusdb);

if (!$models_con) {
    echo "failed to connect to database!";
}

// get doc lens
$dls = [];
$query = "SELECT Word_Count FROM Metadata Where QID in ($qids_string);";
if ($result = $corpus_con->query($query)) {
    while ($row = $result->fetch_row()) {
	$dls[] = $row[0];
    }
}

// get doc topics
$dts = [];
$query = "SELECT * FROM doc_topics Where QID in ($qids_string);";
if ($result = $models_con->query($query)) {
    while ($row = $result->fetch_row()) {
	$dt = [];
	foreach ($row as $val) {
	    if ($val <= 1) {
	    $dt[] = $val;
	    }
	}
	array_push($dts, $dt);
    }
}

$combined['doc_lens'] = $dls;
$combined['doc_topics'] = $dts;

if (empty($combined))
    $results = "";
else {
    $results = json_encode($combined);
}


mysqli_close($models_con);

?>
