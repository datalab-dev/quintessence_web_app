<?php
    require_once('config.php');

    /* connect to the models database */
    $models_con = getModelsCon();

    $word = $_GET['word'];
    $decades = range(1480, 1700, 10);
    $relFreqs = [];
    $rawFreqs = [];

    /* for each decade query table for relative frequency */
    foreach ($decades as $decade) {
        $table = $decade . "_freq";
        $sql = "SELECT rel_freq, freq FROM $table WHERE word = '$word';";
        $result = mysqli_query($models_con, $sql);
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
