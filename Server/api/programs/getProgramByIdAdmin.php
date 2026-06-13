<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

include "../../config.php";

$data = json_decode(file_get_contents("php://input"), true);
$id = intval($data["id"]);

$result = mysqli_query($link, "
SELECT id, title, description, duration_days, difficulty_level, category_id, image_url
FROM programs
WHERE id = $id
");

$program = mysqli_fetch_assoc($result);

if ($program && $program["image_url"]) {
    $program["image_url"] = "http://fitnessfly.local/" . $program["image_url"];
}

echo json_encode($program);