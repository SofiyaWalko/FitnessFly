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

$user_id = isset($data["user_id"]) ? intval($data["user_id"]) : null;

$query = "
SELECT 
    r.id,
    r.title,
    r.image_url,
    r.points_price,
    r.calories,
    c.category_name,
    " . ($user_id ? "EXISTS(
        SELECT 1 FROM favorites_rc fr 
        WHERE fr.recipe_id = r.id AND fr.user_id = $user_id
    )" : "0") . " AS is_favorite,
    " . ($user_id ? "EXISTS(
        SELECT 1 FROM recipes_purchases rp 
        WHERE rp.recipe_id = r.id AND rp.user_id = $user_id
    )" : "0") . " AS is_purchased
FROM recipes r
JOIN recipe_category c ON c.id = r.category_id
WHERE r.is_archived = 0
ORDER BY r.id DESC
";

$result = mysqli_query($link, $query);

$recipes = [];

while ($row = mysqli_fetch_assoc($result)) {

    $recipes[] = [
        "id" => $row["id"],
        "title" => $row["title"],
        "category" => $row["category_name"],
        "points" => intval($row["points_price"]),
        "image" => "http://fitnessfly.local/" . $row["image_url"],
        "isFavorite" => $row["is_favorite"] ? true : false,
        "isPurchased" => $row["is_purchased"] ? true : false,
        "calories" => intval($row["calories"])
    ];
}

echo json_encode($recipes);