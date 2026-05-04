<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include "../../config.php";

$data = json_decode(file_get_contents("php://input"), true);

$user_id = intval($data["user_id"]);
$recipe_id = intval($data["recipe_id"]);

if(!$user_id || !$recipe_id){
    echo json_encode(["error"=>"missing data"]);
    exit;
}

$query = "
INSERT IGNORE INTO favorites_rc (user_id, recipe_id)
VALUES ($user_id, $recipe_id)
";

mysqli_query($link,$query);

echo json_encode(["success"=>true]);