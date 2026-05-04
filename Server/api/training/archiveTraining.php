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

/* ======================
   ПРОВЕРКА: используется ли тренировка
====================== */
$check = mysqli_query($link, "
SELECT id FROM program_day_trainings
WHERE training_id = $id
LIMIT 1
");

if (mysqli_num_rows($check) > 0) {
	echo json_encode([
		"success" => false,
		"error" => "Тренировка используется в программе"
	]);
	exit;
}

/* ======================
   АРХИВИРОВАНИЕ
====================== */
mysqli_query($link, "
UPDATE trainings SET is_archived = 1 WHERE id = $id
");

echo json_encode(["success" => true]);