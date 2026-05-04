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
$id = intval($data["id"]);

// удаляем связи
mysqli_query($link, "DELETE FROM user_programs WHERE program_id = $id");
mysqli_query($link, "DELETE FROM program_days WHERE program_id = $id");

// удаляем саму программу
mysqli_query($link, "DELETE FROM programs WHERE id = $id");

echo json_encode(["success" => true]);