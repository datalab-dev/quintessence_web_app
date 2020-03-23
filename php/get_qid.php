<?php
    /* connect to the database */
    $corpus_con = getCorpusCon();

    /* given file id get qid */
    function getQID($fileid) {
        /* query database */
        global $corpus_con;
        $sql = "SELECT QID FROM Metadata WHERE File_ID = '$fileid';";
        $result = mysqli_query($corpus_con, $sql);
        $row = mysqli_fetch_assoc($result);
        // echo json_encode($fileid);
        return $row['QID'];
    }

    if ($_GET) {
        $fileids = $_GET['fileids'];
    } else {
        $fileid = $argv[1];
    }


    // $corpus_con = mysqli_connect($server, $user, $password, $corpusdb);

    // $qid = getQID($corpus_con, $fileid);

    $qids = array_map('getQID', $fileids);

    mysqli_close($corpus_con);

    echo json_encode($qids);
?>
