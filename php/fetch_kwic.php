<?php
    $time_start = microtime(true);

    /* given word get the top n documents based on tfidf score */
    function getDocuments($conn, $word) {
        /* query database */
        $sql = "SELECT * FROM top_tfidf WHERE word = '$word';";
        $result = mysqli_query($conn, $sql);
        $row = mysqli_fetch_assoc($result);
        $documents = json_decode($row["positions"]);

        return $documents;
    }


    /* return the context window for the first occurence of word */
    function getKwic($pos, $std, $lemma, $word, $n) {
        $arrLemma = explode("\t", $lemma);
        $arrStd = explode("\t", $std);

        if (!$pos || $pos > sizeof($arrStd) - 1)
            return array('word'=>'', 'window'=>'');

        $wordStd = $arrStd[$pos - 1];
        $start = $pos - $n;
        if ($start < 0) {
            $start = 0;
        }
        $words = array_slice($arrStd, $start, 2*$n+1);
        // echo json_encode($words) . "\n";
        return array('word'=>$word, 'window'=>implode(' ', $words));
    }


    /* given a document get the lemmatized kwic window */
    function getLemma($conn, $id, $word, $n, $pos) {
        $sql = "SELECT Standardized, Lemma FROM Truncated_Corpus WHERE File_ID = '$id';";
        $result = mysqli_query($conn, $sql);
        $row = mysqli_fetch_assoc($result);
        mysqli_free_result($result);

        return getKwic($pos, $row["Standardized"], $row["Lemma"], $word, $n);
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
    $conn = mysqli_connect($host, $user, $password, $dbname);

    $documents = getDocuments($conn, $word);
    mysqli_close($conn);

    $dbnameCorpus = 'quintessence_corpus';
    $connCorpus = mysqli_connect($host, $user, $password, $dbnameCorpus);

    $result = array();
    foreach ($documents as $id => $pos) {
        $text = getLemma($connCorpus, $id, $word, $N, $pos);
        if ($text['window'] != '') {
            $result[$id] = $text;
        }
    }
    echo json_encode($result);
?>
