<?php
// database connection info
$user = 'q_user';
$password = 'quintessence';
$modelsdb = 'EEBO_Models';
$corpusdb = 'quintessence_corpus';
$server = '127.0.0.1';


function getCorpusCon() {
    global $user, $password, $modelsdb, $corpusdb, $server;
    $corpus_con = new mysqli($server, $user, $password, $corpusdb);
    if (!$corpus_con)
        echo "failed to connect to corpus database!";

    mysqli_set_charset($corpus_con, 'utf8');
    return $corpus_con;
}

function getModelsCon() {
    global $user, $password, $modelsdb, $corpusdb, $server;
    $models_con = new mysqli($server, $user, $password, $modelsdb);
    if (!$models_con)
        echo "failed to connect to models database!";

    mysqli_set_charset($corpus_con, 'utf8');
    return $models_con;
}
?>
