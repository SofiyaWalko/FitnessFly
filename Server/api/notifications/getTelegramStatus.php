<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include "../../config.php";

$data = json_decode(file_get_contents("php://input"), true);
$user_id = intval($data["user_id"]);

$res = mysqli_query($link, "
SELECT telegram_id, telegram_username, type_id
FROM user_notification_settings
WHERE user_id = $user_id
LIMIT 1
");

$row = mysqli_fetch_assoc($res);

$telegram_connected = !empty($row['telegram_id']);
$is_telegram_type = $row['type_id'] == 2;
$telegram_username = $row['telegram_username'] ?? '';

echo json_encode([
    "telegram_connected" => $telegram_connected,
    "is_telegram_type" => $is_telegram_type,
    "telegram_username" => $telegram_username,
    "user_id" => $user_id
]);
