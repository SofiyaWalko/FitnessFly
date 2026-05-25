<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include "../../config.php";

$data = json_decode(file_get_contents("php://input"), true);

$user_id = intval($data["user_id"]);
$type_id = intval($data["type_id"]);

mysqli_query($link, "
UPDATE user_notification_settings
SET type_id = $type_id
WHERE user_id = $user_id
");

echo json_encode(["success" => true]);