<?php
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include "../../config.php";

$data = json_decode(file_get_contents("php://input"), true);

$user_id = intval($data['user_id'] ?? 0);
$program_id = intval($data['program_id'] ?? 0);

if (!$user_id || !$program_id) {
    echo json_encode(["error" => "Missing data"]);
    exit;
}

/* ======================
   1. Проверка: не начата ли уже программа
====================== */
$check = mysqli_query($link, "
SELECT id FROM user_programs
WHERE user_id = $user_id AND program_id = $program_id
LIMIT 1
");

if ($check && mysqli_num_rows($check) > 0) {
    echo json_encode(["message" => "Program already started"]);
    exit;
}

/* ======================
   2. Создаём user_programs
====================== */
mysqli_query($link, "
INSERT INTO user_programs (user_id, program_id, started_at, current_day)
VALUES ($user_id, $program_id, NOW(), 1)
");

$user_program_id = mysqli_insert_id($link);

/* ======================
   3. Получаем дни программы
====================== */
$days = mysqli_query($link, "
SELECT id, day_number
FROM program_days
WHERE program_id = $program_id
ORDER BY day_number
");

if (!$days || mysqli_num_rows($days) === 0) {
    echo json_encode(["error" => "No days found"]);
    exit;
}

/* ======================
   4. Создаём user_program_day
   (первый день открываем сразу)
====================== */
while ($day = mysqli_fetch_assoc($days)) {

    if ($day['day_number'] == 1) {
        mysqli_query($link, "
        INSERT INTO user_program_day (user_program_id, day_id, status, opened_at)
        VALUES ($user_program_id, {$day['id']}, 'opened', NOW())
        ");
    } else {
        mysqli_query($link, "
        INSERT INTO user_program_day (user_program_id, day_id, status)
        VALUES ($user_program_id, {$day['id']}, 'locked')
        ");
    }
}

echo json_encode([
    "success" => true,
    "user_program_id" => $user_program_id
]);