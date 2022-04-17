<?php
require 'vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();
if (isset($_GET['details']) && $_GET['details'] == True && isset($_GET['recipe'])) {
   $host = $_ENV['PG_HOST'];
   $database = $_ENV['PG_DATABASE'];
   $user = $_ENV['PG_USER'];
   $pass = $_ENV['PG_PASSWORD'];
   $port = $_ENV['PG_PORT'];
   $connection = pg_connect("host=$host port=$port dbname=$database user=$user password=$pass");
   if (!$connection) {
      echo "Cannot connect to database";
      return;
   }
   $recipe = $_GET['recipe'];
   $request = pg_query(
      $connection,
      "SELECT item, price, calories_per_100g, weight, amount, recipe_book.name AS recipeName, ingredients.name FROM (SELECT * FROM recipe_book INNER JOIN recipes ON recipe_book.recipe=recipes.recipe WHERE recipe_book.recipe='$recipe') AS recipe_book INNER JOIN ingredients ON ingredients.item=recipe_book.ingredient"
   );
   if (!$request) {
      echo "Cannot do request";
      return;
   }
   $response = array();
   while ($row = pg_fetch_object($request)) {
      array_push($response, $row);
   }
   echo json_encode($response);
} else {
   echo "Not requesting details... :(";
}
