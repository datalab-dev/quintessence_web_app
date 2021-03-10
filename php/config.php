<?php
require 'vendor/autoload.php';

// database connection info
$user = '';
$password = '';
$dbname = 'quintessence';
$server = 'datasci.library.ucdavis.edu';
$port = '27017';

function getMongoCon() {
    global $user, $password, $dbname, $server, $port;

    $typemap = ["typeMap" => ['root' => 'array', 'document' => 'array']];
    $url = 'mongodb://'.$server.':'.$port;
    $con = new MongoDB\Client($url, [], $typemap);

    if (!$con)
        echo 'failed to connect to database!';

    $db = $con->{$dbname};
    return $db;
}

$db = getMongoCon();
?>
