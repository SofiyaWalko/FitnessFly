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

$res = mysqli_query($link, "
SELECT id, title, duration_days, difficulty_level, image_url
FROM programs
WHERE is_archived = 1
ORDER BY id DESC
");

$data = [];

while ($row = mysqli_fetch_assoc($res)) {
    $row['image_url'] = "http://fitnessfly.local/" . $row['image_url'];
	$data[] = [
		"id" => $row["id"],
		"title" => $row["title"],
		"duration_days" => $row["duration_days"],
		"difficulty_level" => $row["difficulty_level"],
		"image_url" => $row["image_url"]
	];
}

echo json_encode($data);