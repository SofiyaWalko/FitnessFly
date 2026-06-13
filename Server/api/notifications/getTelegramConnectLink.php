<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include __DIR__ . "/../../config.php";

$data = json_decode(file_get_contents("php://input"), true);
$user_id = intval($data["user_id"]);

$bot_token = TELEGRAM_BOT_TOKEN;
$me_url = "https://api.telegram.org/bot$bot_token/getMe";
$me_response = file_get_contents($me_url);
$me_data = json_decode($me_response, true);

if (!$me_data || empty($me_data["ok"])) {
    echo json_encode([
        "success" => false,
        "error" => "Не удалось получить данные бота"
    ]);
    exit;
}

$username = $me_data["result"]["username"] ?? null;

if (!$username) {
    echo json_encode([
        "success" => false,
        "error" => "Не найден username бота"
    ]);
    exit;
}

$connect_url = "https://t.me/$username?start=$user_id";

echo json_encode([
    "success" => true,
    "username" => $username,
    "connect_url" => $connect_url,
    "user_id" => $user_id
]);
