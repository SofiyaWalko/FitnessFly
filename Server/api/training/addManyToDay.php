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
$ids = $data["training_ids"];

$res = mysqli_query($link, "
SELECT id FROM program_days
WHERE program_id = $program_id AND day_number = $day_number
");

$day = mysqli_fetch_assoc($res);
$day_id = $day["id"];

$res = mysqli_query($link, "
SELECT MAX(order_number) as max_order
FROM program_day_trainings
WHERE program_day_id = $day_id
");

$row = mysqli_fetch_assoc($res);
$order = ($row["max_order"] ?? 0) + 1;

foreach ($ids as $id) {
	mysqli_query($link, "
	INSERT INTO program_day_trainings (program_day_id, training_id, order_number)
	VALUES ($day_id, $id, $order)
	");
	$order++;
}

echo json_encode(["success" => true]);