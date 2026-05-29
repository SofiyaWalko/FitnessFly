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

if (!$user_id) {
    echo json_encode(["success" => false, "error" => "Не указан ID пользователя"]);
    exit;
}

// Очищаем telegram_id и сбрасываем способ уведомлений на Email (1)
$query = mysqli_query($link, "
UPDATE user_notification_settings
SET telegram_id = NULL,
    type_id = 1
WHERE user_id = $user_id
");

if ($query) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => mysqli_error($link)]);
}
