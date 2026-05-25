<?php
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

include "../../config.php";

$data = json_decode(file_get_contents("php://input"), true);

$user_id = isset($data["user_id"]) ? intval($data["user_id"]) : 0;

$query = "
SELECT 
    r.id,
    r.title,
    r.description,
    r.points_price,
    r.calories,
    r.image_url,
    c.category_name AS category,
    CASE 
        WHEN f.id IS NULL THEN 0
        ELSE 1
    END AS isFavorite
FROM recipes r
JOIN recipe_category c ON r.category_id = c.id
LEFT JOIN favorites_rc f 
    ON f.recipe_id = r.id 
    AND f.user_id = $user_id
WHERE r.is_archived = 0
ORDER BY r.id DESC
LIMIT 4
";

$result = mysqli_query($link, $query);

$recipes = [];

while ($row = mysqli_fetch_assoc($result)) {

    $recipes[] = [
        "id"=>$row["id"],
        "title"=>$row["title"],
        "description"=>$row["description"],
        "points_price"=>$row["points_price"],
        "image_url"=>"http://fitnessfly.local/".$row["image_url"],
        "category"=>$row["category"],
        "isFavorite"=>boolval($row["isFavorite"]),
        "calories" => intval($row["calories"])
    ];
}

echo json_encode($recipes);