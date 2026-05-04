<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include "../../config.php";

$data = json_decode(file_get_contents("php://input"), true);
if (!$data) {
    $data = $_GET;
}

$user_id = intval($data["user_id"]);
$training_id = intval($data["training_id"]);

if(!$user_id || !$training_id){
    echo json_encode(["error"=>"missing data"]);
    exit;
}

$query = "
DELETE FROM favorites_tr
WHERE user_id = $user_id
AND training_id = $training_id
";

mysqli_query($link,$query);

echo json_encode(["success"=>true]);