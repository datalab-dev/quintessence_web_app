<?php
    /* given file id get qid */
    function getQID($conn, $fileid) {
        /* query database */
        $sql = "SELECT QID FROM Metadata WHERE File_ID = '$fileid';";
        $result = mysqli_query($conn, $sql);
        $row = mysqli_fetch_assoc($result);
        return $row['QID'];
    }

    if ($_GET) {
        $fileid = $_GET['fileid'];
    } else {
        $fileid = $argv[1];
    }

    /* connect to the database */
    require_once("config.php");
    $dbnameCorpus = 'quintessence_corpus';
    $conn = mysqli_connect($server, $user, $password, $corpusdb);

    $qid = getQID($conn, $fileid);
    mysqli_close($conn);

    echo json_encode($qid);
?>
