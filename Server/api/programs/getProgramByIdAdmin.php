<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

include "../../config.php";

$data = json_decode(file_get_contents("php://input"), true);
$id = intval($data["id"]);

$result = mysqli_query($link, "
SELECT id, title, description, duration_days, difficulty_level, category_id
FROM programs
WHERE id = $id
");

echo json_encode(mysqli_fetch_assoc($result));