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

$res = mysqli_query($link, "
SELECT COUNT(*) as total
FROM program_day_trainings
WHERE training_id = $id
");

$row = mysqli_fetch_assoc($res);

echo json_encode([
	"used" => $row["total"] > 0,
	"count" => intval($row["total"])
]);