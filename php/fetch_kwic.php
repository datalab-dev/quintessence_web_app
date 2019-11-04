<?php
    $time_start = microtime(true);

    /* helper function to form a basic sql query */
    function getRow($table, $word) {
        return "SELECT * FROM $table WHERE word = '$word';";
    }


    /* given word get the top n documents based on tfidf score */
    function getDocuments($conn, $word) {
        /* query database */
        $sql = getRow('dtm_tfidf', $word);
        $result = mysqli_query($conn, $sql);
        $row = mysqli_fetch_assoc($result);

        /* parse row */
        unset($row['word']);
        $documents = array_values($row);

        return $documents;
    }


    /* return the context window for the first occurence of word */
    function getKwic($text, $word, $n) {
        $arr = explode("\t", $text);
        $pos = array_search($word, $arr);

        if ($pos) {
            $words = array_slice($arr, $pos-$n, 2*$n+1);
            return implode(' ', $words);
        } else {
            return '';
        }
    }


    /* given a document get the lemmatized text */
    function getLemma($conn, $id, $word, $n) {
        $sql = "SELECT Lemma FROM Truncated_Corpus WHERE File_ID = '$id';";

        if ($stmt = mysqli_prepare($conn, $sql)) {
            /* fetch the full text */
            mysqli_stmt_execute($stmt);
            mysqli_stmt_store_result($stmt);
            mysqli_stmt_bind_result($stmt, $lemma);
            mysqli_stmt_fetch($stmt);

            /* search text for word */
            return getKwic($lemma, $word, $n);
        }

        return "";
    }


    if ($_GET) {
        $word = $_GET['word'];
    } else {
        $word = $argv[1];
    }

    $N = 4; // window size

    /* connect to the database */
    $host = '127.0.0.1';
    $user = 'q_user';
    $password = 'quintessence';
    $dbname = 'EEBO_Models';
    $conn = mysqli_connect($host, $user, $password, $dbname, $port);

    $documents = getDocuments($conn, $word);
    mysqli_close($conn);

    $dbnameCorpus = 'quintessence_corpus';
    $connCorpus = mysqli_connect($host, $user, $password, $dbnameCorpus, $port);

    $result = array();
    foreach ($documents as $document) {
        $text = getLemma($connCorpus, $document, $word, $N);
        if ($text != '') {
            $result[$document] = $text;
        }
    }
    echo json_encode($result);
?>
