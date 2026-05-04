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
SELECT 
    r.id,
    r.title,
    r.image_url,
    r.points_price,
    r.calories,
    c.category_name
FROM recipes r
JOIN recipe_category c ON c.id = r.category_id
WHERE r.is_archived = 1
ORDER BY r.id DESC
");

$data = [];

while ($row = mysqli_fetch_assoc($res)) {
    $row['image_url'] = "http://fitnessfly.local/" . $row['image_url'];
	$data[] = [
		"id" => $row["id"],
		"title" => $row["title"],
		"category" => $row["category_name"],
		"calories" => $row["calories"],
		"points" => $row["points_price"],
        "image" => $row["image_url"]
	];
}

echo json_encode($data);