<?php
    /* connect to the models database */
    $host = '127.0.0.1';
    $user = 'q_user';
    $password = 'quintessence';
    $dbname = 'EEBO_Models';
    $conn = mysqli_connect($host, $user, $password, $dbname);

    $word = $_GET['word'];
    $decades = range(1480, 1700, 10);
    $frequencies = [];

    /* for each decade query table for relative frequency */
    foreach ($decades as $decade) {
        $table = $decade . "_freq";
        $sql = "SELECT rel_freq FROM $table WHERE word = '$word';";
        $result = mysqli_query($conn, $sql);
        $row = mysqli_fetch_assoc($result);
        foreach ($row as $key => $value) {
            array_push($frequencies, $value);
        }
    }

    echo json_encode($frequencies);
?>