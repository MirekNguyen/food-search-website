<?php
// Load environment variables to connect to database
require 'vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();
$host = $_ENV['PG_HOST'];
$database = $_ENV['PG_DATABASE'];
$user = $_ENV['PG_USER'];
$pass = $_ENV['PG_PASSWORD'];
$port = $_ENV['PG_PORT'];

$connection = pg_connect("host=$host port=$port dbname=$database user=$user password=$pass");
if (!$connection) {
   echo "Error with connection";
   return;
}
$query = pg_query($connection, "SELECT DISTINCT recipe FROM recipes");
if (!$query) {
   echo "Problem with query";
   return;
}
$result = array();
while ($fetch = pg_fetch_object($query)) {
   array_push($result, $fetch->recipe);
}
pg_close($connection);

echo json_encode($result);

