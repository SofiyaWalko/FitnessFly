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

$result = mysqli_query($link, "SELECT id, category_name FROM recipe_category");

$categories = [];

while ($row = mysqli_fetch_assoc($result)) {
	$categories[] = [
		"id" => $row["id"],
		"name" => $row["category_name"]
	];
}

echo json_encode($categories);