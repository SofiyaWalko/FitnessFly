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
    fr.id as is_favorite,
    rp.id as is_purchased
FROM recipes r
JOIN recipe_category c ON c.id = r.category_id

LEFT JOIN favorites_rc fr 
    ON fr.recipe_id = r.id 
    " . ($user_id ? "AND fr.user_id = $user_id" : "") . "

LEFT JOIN recipes_purchases rp 
    ON rp.recipe_id = r.id 
    " . ($user_id ? "AND rp.user_id = $user_id" : "") . "

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