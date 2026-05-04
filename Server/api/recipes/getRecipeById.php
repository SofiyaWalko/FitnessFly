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

if (!$data) {
    $data = $_GET;
}

$recipe_id = intval($data["id"] ?? 0);
$user_id = intval($data["user_id"] ?? 0);

if (!$recipe_id) {
    echo json_encode(["error" => "No recipe id"]);
    exit;
}

/* ======================
   1. РЕЦЕПТ
====================== */
$query = "
SELECT 
    r.id,
    r.title,
    r.description,
    r.image_url,
    r.points_price,
    c.category_name
FROM recipes r
JOIN recipe_category c ON c.id = r.category_id
WHERE r.id = $recipe_id
";

$result = mysqli_query($link, $query);

if (!$result || mysqli_num_rows($result) === 0) {
    echo json_encode(["error" => "Recipe not found"]);
    exit;
}

$recipe = mysqli_fetch_assoc($result);

/* ======================
   2. ПРОВЕРКА ДОСТУПА
====================== */

$isPurchased = false;

if ($user_id) {

    $check = mysqli_query($link, "
    SELECT id FROM recipes_purchases 
    WHERE user_id = $user_id AND recipe_id = $recipe_id
    LIMIT 1
    ");

    $isPurchased = $check && mysqli_num_rows($check) > 0;
}

// доступ: бесплатно ИЛИ куплено
$hasAccess = ($recipe["points_price"] == 0) || $isPurchased;

/* ======================
   2. ИНГРЕДИЕНТЫ
====================== */
$ingredientsQuery = "
SELECT name, quantity
FROM recipe_ingredients
WHERE recipe_id = $recipe_id
";

$ingredientsResult = mysqli_query($link, $ingredientsQuery);

$ingredients = [];

while ($row = mysqli_fetch_assoc($ingredientsResult)) {
    $ingredients[] = [
        "name" => $row["name"],
        "quantity" => $row["quantity"]
    ];
}

/* ======================
   3. ШАГИ ПРИГОТОВЛЕНИЯ
====================== */
$stepsQuery = "
SELECT step_number, image_url, description
FROM recipe_steps
WHERE recipe_id = $recipe_id
ORDER BY step_number ASC
";

$stepsResult = mysqli_query($link, $stepsQuery);

$steps = [];

while ($step = mysqli_fetch_assoc($stepsResult)) {

    $steps[] = [
        "step_number" => intval($step["step_number"]),
        "description" => $step["description"],
        "image_url" => $step["image_url"]
            ? "http://fitnessfly.local/images" . $step["image_url"]
            : null
    ];
}

/* ======================
   4. ОТВЕТ
====================== */
$response = [
    "id" => $recipe["id"],
    "title" => $recipe["title"],
    "description" => $recipe["description"],
    "image" => "http://fitnessfly.local/" . $recipe["image_url"],
    "points" => $recipe["points_price"],
    "category" => $recipe["category_name"],
    "ingredients" => $ingredients,
    "steps" => $steps,
    "hasAccess" => $hasAccess,
    
];

echo json_encode($response);