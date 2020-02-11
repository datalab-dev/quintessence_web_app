<?php
    /* connect to the corpus database */
    $host = '127.0.0.1';
    $user = 'q_user';
    $password = 'quintessence';
    $dbname = 'EEBO_Models';
    $conn = mysqli_connect($host, $user, $password, $dbname);

    /* document frequency by decade */
    $sql = "SELECT decade, COUNT(*) FROM EEBO_Metadata GROUP BY decade ORDER BY decade;";
    $result = mysqli_query($conn, $sql);
    $docFreqs = [];
    while ($row = mysqli_fetch_assoc($result)) {
        array_push($docFreqs, $row['COUNT(*)']);
    }
    $docFreqs = array_slice($docFreqs, 2); // remove unknown and 1470

    /* word frequency by decade */
    $sql = "SELECT decade, SUM(Word_Count) FROM EEBO_Metadata GROUP BY decade ORDER BY decade;";
    $result = mysqli_query($conn, $sql);
    $wordFreqs = [];
    while ($row = mysqli_fetch_assoc($result)) {
        array_push($wordFreqs, $row['SUM(Word_Count)']);
    }
    $wordFreqs = array_slice($wordFreqs, 2); // remove unknown and 1470

    $result = array(
        'docFreqs'=>$docFreqs,
        'wordFreqs'=>$wordFreqs
    );
    echo json_encode($result);
?>
