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

$id = intval($_POST["id"]);
$title = $_POST["title"];
$description = $_POST["description"];
$category_id = intval($_POST["category_id"]);
$points = intval($_POST["points"]);
$calories = intval($_POST["calories"]);

$ingredients = json_decode($_POST["ingredients"], true);
$steps = json_decode($_POST["steps"], true);

// обновляем рецепт
mysqli_query($link, "
UPDATE recipes SET
	title = '$title',
	description = '$description',
	category_id = $category_id,
	points_price = $points,
	calories = $calories
WHERE id = $id
");

// если загрузили новую картинку
if (isset($_FILES["image"])) {
	$uploadDir = "D:/Diplom/FitnessFly/Server/images/recipes/";
	$fileName = time() . "_" . $_FILES["image"]["name"];
	move_uploaded_file($_FILES["image"]["tmp_name"], $uploadDir . $fileName);

	$image_url = "images/recipes/" . $fileName;

	mysqli_query($link, "
	UPDATE recipes SET image_url = '$image_url' WHERE id = $id
	");
}

// пересохраняем ингредиенты
mysqli_query($link, "DELETE FROM recipe_ingredients WHERE recipe_id = $id");

foreach ($ingredients as $ing) {
	mysqli_query($link, "
	INSERT INTO recipe_ingredients (recipe_id, name, quantity)
	VALUES ($id, '{$ing["name"]}', '{$ing["quantity"]}')
	");
}

mysqli_query($link, "DELETE FROM recipe_steps WHERE recipe_id = $id");

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
        VALUES ($id, $step_number, '$description', " .
        ($image_url ? "'$image_url'" : "NULL") . ")
    ");
}

echo json_encode(["success" => true]);