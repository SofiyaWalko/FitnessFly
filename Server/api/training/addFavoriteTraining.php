<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include "../../config.php";

//читаем JSON
$data = json_decode(file_get_contents("php://input"), true);

//fallback для браузера
if (!$data) {
    $data = $_GET;
}

$user_id = intval($data["user_id"] ?? 0);
$training_id = intval($data["training_id"] ?? 0);

if (!$user_id || !$training_id) {
    echo json_encode(["error" => "missing data"]);
    exit;
}

/* ======================
   Проверка: выполнена ли тренировка
====================== */

$checkCompleted = mysqli_query($link, "
SELECT utp.id
FROM user_training_progress utp
JOIN user_program_day upd ON upd.id = utp.user_program_day_id
JOIN user_programs up ON up.id = upd.user_program_id
WHERE utp.training_id = $training_id
AND up.user_id = $user_id
LIMIT 1
");

if (!$checkCompleted || mysqli_num_rows($checkCompleted) === 0) {
    echo json_encode([
        "success" => false,
        "message" => "Можно добавлять только выполненные тренировки"
    ]);
    exit;
}

$query = "
INSERT IGNORE INTO favorites_tr (user_id, training_id)
VALUES ($user_id, $training_id)
";

if (!mysqli_query($link, $query)) {
    echo json_encode(["error" => mysqli_error($link)]);
    exit;
}

echo json_encode(["success" => true]);