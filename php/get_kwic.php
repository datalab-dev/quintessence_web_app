<?php
require 'vendor/autoload.php';
require 'config.php';


/* given term get the top n documents based on tfidf score */
function getDocuments($db, $term) {
    $collection = $db->{'terms.positions'};
    $cursor = $collection->find(['_id' => $term]);
    $documents = $cursor->toArray()[0]['firstPositions'];

    return $documents;
}


/* return the context window for the first occurence of term */
function getKwic($pos, $std, $lemma, $term, $n) {
    $arrLemma = explode("\t", $lemma);
    $arrStd = explode("\t", $std);

    if (!$pos || $pos > sizeof($arrStd) - 1)
        return array('term'=>'', 'window'=>'');

    $termStd = $arrStd[$pos - 1];
    $start = $pos - $n;
    if ($start < 0) {
        $start = 0;
    }
    $terms = array_slice($arrStd, $start, 2*$n+1);

    return array('term'=>$term, 'window'=>implode(' ', $terms));
}


/* given a document get the lemmatized kwic window */
function getLemma($db, $qid, $term, $n, $pos) {
    $collection = $db->docs;
    $cursor = $collection->find(
        [
            '_id' => $qid
        ],
        [
            'projection' => [
                '_id' => 0,
                'standardized' => 1,
                'lemma' => 1,
            ]
        ]
    );
    $res = $cursor->toArray()[0];

    return getKwic($pos, $res["standardized"], $res["lemma"], $term, $n);
}


if ($_GET) {
    $term = $_GET['term'];
} else {
    $term = $argv[1];
}

$N = 20; // window size
$db = getMongoCon();

$documents = getDocuments($db, $term);
foreach ($documents as $doc) {
    $qid = $doc['qid'];
    $pos = $doc['position'];
    $text = getLemma($db, $qid, $term, $N, $pos);
    if ($text['window'] != '') {
        $result[$qid] = $text;
    }
}

echo json_encode($result);
?>
