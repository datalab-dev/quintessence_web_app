<?php
    /* connect to the models database */
    $host = '127.0.0.1';
    $user = 'q_user';
    $password = 'quintessence';
    $dbname = 'EEBO_Models';
    $conn = mysqli_connect($host, $user, $password, $dbname);

    $word = $_GET['word'];
    $decades = range(1480, 1700, 10);
    $relFreqs = [];
    $rawFreqs = [];

    /* for each decade query table for relative frequency */
    foreach ($decades as $decade) {
        $table = $decade . "_freq";
        $sql = "SELECT rel_freq, freq FROM $table WHERE word = '$word';";
        $result = mysqli_query($conn, $sql);
        while ($row = mysqli_fetch_assoc($result)) {
            $padded = sprintf('%0.4f', $row['rel_freq']);
            array_push($relFreqs, $padded);
            array_push($rawFreqs, $row['freq']);
        }
    }

    $result = array(
        'relFreqs'=>$relFreqs,
        'rawFreqs'=>$rawFreqs
    );
    echo json_encode($result);
?>
