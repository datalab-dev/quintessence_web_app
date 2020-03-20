<?php
    /* connect to the database */
    require_once("config.php");
    $dbnameCorpus = 'quintessence_corpus';
    $conn = mysqli_connect($server, $user, $password, $corpusdb);

    /* given file id get qid */
    function getQID($fileid) {
        /* query database */
        global $conn;
        $sql = "SELECT QID FROM Metadata WHERE File_ID = '$fileid';";
        $result = mysqli_query($conn, $sql);
        $row = mysqli_fetch_assoc($result);
        // echo json_encode($fileid);
        return $row['QID'];
    }

    if ($_GET) {
        $fileids = $_GET['fileids'];
    } else {
        $fileid = $argv[1];
    }


    // $conn = mysqli_connect($server, $user, $password, $corpusdb);

    // $qid = getQID($conn, $fileid);

    $qids = array_map('getQID', $fileids);

    mysqli_close($conn);

    echo json_encode($qids);
?>
