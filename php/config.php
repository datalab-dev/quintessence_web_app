<?php
require 'vendor/autoload.php';

// database connection info
$user = '';
$password = '';
$dbname = 'test';
$server = '127.0.0.1';
$port = '27017';

function getMongoCon() {
    global $user, $password, $dbname, $server, $port;

    $url = 'mongodb://'.$server.':'.$port;
    $con = new MongoDB\Client($url);

    if (!$con)
        echo 'failed to connect to database!';

    $db = $con->{$dbname};
    return $db;
}
?>
