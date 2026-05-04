<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include "../../config.php";

$data = json_decode(file_get_contents("php://input"), true);
$id = intval($data["id"]);

$res = mysqli_query($link, "
SELECT id, title, description, category_id, points_price, calories, image_url
FROM recipes
WHERE id = $id
");

$recipe = mysqli_fetch_assoc($res);

$ingredientsRes = mysqli_query($link, "
SELECT name, quantity FROM recipe_ingredients WHERE recipe_id = $id
");

$ingredients = [];

while ($row = mysqli_fetch_assoc($ingredientsRes)) {
	$ingredients[] = $row;
}

$stepsRes = mysqli_query($link, "
SELECT step_number, description, image_url
FROM recipe_steps
WHERE recipe_id = $id
ORDER BY step_number ASC
");

$steps = [];

while ($row = mysqli_fetch_assoc($stepsRes)) {
    $steps[] = $row;
}

echo json_encode([
	"id" => $recipe["id"],
	"title" => $recipe["title"],
	"description" => $recipe["description"],
	"category_id" => $recipe["category_id"],
	"points" => $recipe["points_price"],
	"calories" => $recipe["calories"],
	"image" => $recipe["image_url"],
	"ingredients" => $ingredients,
	"steps" => $steps
]);