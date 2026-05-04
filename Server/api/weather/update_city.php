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

$user_id = intval($data["user_id"]);
$city = mb_convert_case(trim($data["city"]), MB_CASE_TITLE, "UTF-8");

if(!$city){
    echo json_encode(["status"=>"error","message"=>"Введите город"]);
    exit;
}

$query = "
UPDATE users_personal_info 
SET city = '$city'
WHERE user_id = $user_id
";

mysqli_query($link, $query);

echo json_encode(["status"=>"success"]);