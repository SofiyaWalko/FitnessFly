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

$program_id = intval($data["program_id"]);
$day_number = intval($data["day_number"]);

/* ======================
   НАЙТИ ID ДНЯ
====================== */
$result = mysqli_query($link, "
SELECT id FROM program_days 
WHERE program_id = $program_id AND day_number = $day_number
");

$row = mysqli_fetch_assoc($result);

if (!$row) {
    echo json_encode(["success" => false]);
    exit;
}

$day_id = $row["id"];

/* ======================
   УДАЛЯЕМ ТРЕНИРОВКИ
====================== */
mysqli_query($link, "
DELETE FROM program_day_trainings 
WHERE program_day_id = $day_id
");

/* ======================
   УДАЛЯЕМ ДЕНЬ
====================== */
mysqli_query($link, "
DELETE FROM program_days
WHERE id = $day_id
");

/* ======================
   ПЕРЕНУМЕРАЦИЯ ДНЕЙ
   (сдвигаем все последующие дни на 1 вниз,
   чтобы нумерация осталась последовательной)
====================== */
mysqli_query($link, "
UPDATE program_days
SET day_number = day_number - 1
WHERE program_id = $program_id AND day_number > $day_number
");

/* ======================
   ОБНОВЛЯЕМ КОЛ-ВО ДНЕЙ
====================== */
$result = mysqli_query($link, "
SELECT COUNT(*) as total 
FROM program_days 
WHERE program_id = $program_id
");

$row = mysqli_fetch_assoc($result);
$total_days = $row["total"];

mysqli_query($link, "
UPDATE programs 
SET duration_days = $total_days
WHERE id = $program_id
");

echo json_encode(["success" => true]);