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
    function getKwic($std, $lemma, $word, $n) {
        $arrLemma = explode("\t", $lemma);
        $arrStd = explode("\t", $std);
        $pos = array_search($word, $arrLemma);
        $wordStd = $arrStd[$pos];

        if ($pos) {
            $start = $pos - $n;
            if ($start < 0) {
                $start = 0;
            }
            $words = array_slice($arrStd, $start, 2*$n+1);
            return array('word'=>$wordStd, 'window'=>implode(' ', $words));
        } else {
            return array('word'=>'', 'window'=>'');
        }
    }


    /* given a document get the lemmatized kwic window */
    function getLemma($conn, $id, $word, $n) {
        $sql = "SELECT Standardized, Lemma FROM Truncated_Corpus WHERE File_ID = '$id';";
        $result = mysqli_query($conn, $sql);
        $row = mysqli_fetch_assoc($result);
        mysqli_free_result($result);
        return getKwic($row["Standardized"], $row["Lemma"], $word, $n);
    }


    if ($_GET) {
        $word = $_GET['word'];
    } else {
        $word = $argv[1];
    }

    $N = 20; // window size

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
        if ($text['window'] != '') {
            $result[$document] = $text;
        }
    }
    echo json_encode($result);
?>
