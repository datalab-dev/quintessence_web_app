<?php
    $time_start = microtime(true);

    /* helper function to form a basic sql query */
    function getRow($table, $word) {
        return "SELECT * FROM $table WHERE word = '$word';";
    }


    /* get the searchable list of words */
    function getWords($conn) {
        $sql = "SELECT word FROM timeseries;";
        $result = mysqli_query($conn, $sql);
        $words = [];

        while ($row = mysqli_fetch_assoc($result)) {
            $words[] = $row['word'];
        }

        return $words;
    }


    /* get the distance of a word to itself over time */
    function getTimeseries($conn, $word) {
        /* query database */
        $sql = getRow('timeseries', $word);
        $result = mysqli_query($conn, $sql);
        $row = mysqli_fetch_assoc($result);

        /* parse row */
        unset($row['word']);
        unset($row[1470]);
        $distances = array_values($row);

        return $distances;
    }


    /* get the nearest neighbors and distance from word for each slice*/
    function getNeighbors($conn, $word, $decades) {
        $results = array();

        foreach ($decades as $decade) {
            $table = $decade . "_neighbors";
            $sql = getRow($table, $word);
            $result = mysqli_query($conn, $sql);
            $row = mysqli_fetch_assoc($result);

            /* parse row */
            $neighbors = [];
            $scores = [];
            foreach ($row as $key => $value) {
                if (strpos($key, 'neighbor') !== false) {
                    array_push($neighbors, $value);
                } else if (strpos($key, 'score') !== false) {
                    array_push($scores, $value);
                }
            }

            /* sort neighbors and scores */
            $comb = array_combine($neighbors, $scores);
            asort($comb);

            $result = array(
                'neighbors'=>array_keys($comb),
                'scores'=>array_values($comb)
            );
            $results[$decade] = $result;
        }

        return $results;
    }


    $word = $_GET['word'];
    $decades = range(1480, 1700, 10);
    $authors = file('../resources/authors.txt', FILE_IGNORE_NEW_LINES);
    $locations = file('../resources/locations.txt', FILE_IGNORE_NEW_LINES);

    /* connect to the database */
    $host = '127.0.0.1';
    $user = 'q_user';
    $password = 'quintessence';
    $dbname = 'EEBO_Models';
    // $port = '3307';
    $conn = mysqli_connect($host, $user, $password, $dbname, $port);

    $words = getWords($conn);
    $wordTimeseries = getTimeseries($conn, $word);
    $decNeighbors = getNeighbors($conn, $word, $decades);
    $authNeighbors = getNeighbors($conn, $word, $authors);
    $locNeighbors = getNeighbors($conn, $word, $locations);
    $fullNeighbors = getNeighbors($conn, $word, array("full"));

    $neighborsTimeseries = array();
    foreach ($decNeighbors[1700]['neighbors'] as $nn) {
        $ts = getTimeseries($conn, $nn);
        $neighborsTimeseries[$nn] = $ts;
    }

    $result = array(
        'words'=>$words,
        'wordTimeseries'=>$wordTimeseries,
        'decNeighbors'=>$decNeighbors,
        'authNeighbors'=>$authNeighbors,
        'locNeighbors'=>$locNeighbors,
        'fullNeighbors'=>$fullNeighbors,
        'neighborsTimeseries'=>$neighborsTimeseries
    );
    echo json_encode($result);

    /* display execution time */
    $time_end = microtime(true);
    $execution_time = ($time_end - $time_start);
    // echo '<b>Total Execution Time:</b> '.$execution_time.' Seconds';
?>
