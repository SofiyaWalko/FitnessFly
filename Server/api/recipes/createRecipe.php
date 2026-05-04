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

$title = $_POST["title"];
$description = $_POST["description"];
$category_id = intval($_POST["category_id"]);
$points = intval($_POST["points"]);
$calories = intval($_POST["calories"]);

$ingredients = json_decode($_POST["ingredients"], true);
$steps = json_decode($_POST["steps"], true);

//загрузка файла
$uploadDir = "D:/Diplom/FitnessFly/Server/images/recipes/";
$fileName = time() . "_" . $_FILES["image"]["name"];
$targetPath = $uploadDir . $fileName;

move_uploaded_file($_FILES["image"]["tmp_name"], $targetPath);

$image_url = "images/recipes/" . $fileName;

//сохраняем рецепт
$query = "
INSERT INTO recipes (title, description, category_id, points_price, image_url, calories)
VALUES ('$title', '$description', $category_id, $points, '$image_url', $calories)
";

mysqli_query($link, $query);

$recipe_id = mysqli_insert_id($link);

//ингредиенты
foreach ($ingredients as $ing) {
	$name = $ing["name"];
	$quantity = $ing["quantity"];

	mysqli_query($link, "
		INSERT INTO recipe_ingredients (recipe_id, name, quantity)
		VALUES ($recipe_id, '$name', '$quantity')
	");
}

/* ======================
   ШАГИ
====================== */

$uploadDir = "D:/Diplom/FitnessFly/Server/images/recipe_steps/";

foreach ($steps as $index => $step) {

    $description = mysqli_real_escape_string($link, $step["description"]);
    $step_number = intval($step["step_number"]);

    $image_url = null;

    if (isset($_FILES["step_image_$index"])) {
        $fileName = time() . "_" . $_FILES["step_image_$index"]["name"];
        move_uploaded_file(
            $_FILES["step_image_$index"]["tmp_name"],
            $uploadDir . $fileName
        );

        $image_url = "/recipe_steps/" . $fileName;
    }

    mysqli_query($link, "
        INSERT INTO recipe_steps (recipe_id, step_number, description, image_url)
        VALUES ($recipe_id, $step_number, '$description', " .
        ($image_url ? "'$image_url'" : "NULL") . ")
    ");
}

echo json_encode(["success" => true]);