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

/* ======================
   НАХОДИМ ПОСЛЕДНИЙ ДЕНЬ
====================== */
$result = mysqli_query($link, "
SELECT MAX(day_number) as last_day 
FROM program_days 
WHERE program_id = $program_id
");

$row = mysqli_fetch_assoc($result);
$next_day = ($row["last_day"] ?? 0) + 1;

/* ======================
   СОЗДАЁМ ДЕНЬ
====================== */
mysqli_query($link, "
INSERT INTO program_days (program_id, day_number, is_rest_day)
VALUES ($program_id, $next_day, 0)
");

/* ======================
   ОБНОВЛЯЕМ КОЛ-ВО ДНЕЙ
====================== */
mysqli_query($link, "
UPDATE programs 
SET duration_days = $next_day
WHERE id = $program_id
");

echo json_encode([
    "success" => true,
    "day_number" => $next_day
]);