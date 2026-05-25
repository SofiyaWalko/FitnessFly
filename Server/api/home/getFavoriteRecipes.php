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

$user_id = isset($data["user_id"]) ? intval($data["user_id"]) : null;

if(!$user_id){
    echo json_encode(["error"=>"user_id not provided"]);
    exit;
}

$query = "
SELECT
    r.id,
    r.title,
    r.image_url,
    r.points_price,
    r.calories,
    c.category_name,
    rp.id as is_purchased
FROM favorites_rc f
JOIN recipes r ON r.id = f.recipe_id
JOIN recipe_category c ON c.id = r.category_id

LEFT JOIN recipes_purchases rp 
ON rp.recipe_id = r.id AND rp.user_id = $user_id

WHERE f.user_id = $user_id
ORDER BY f.id DESC
";

$result = mysqli_query($link,$query);

$recipes = [];

while($row = mysqli_fetch_assoc($result)){

    $recipes[] = [
        "id"=>$row["id"],
        "title"=>$row["title"],
        "category"=>$row["category_name"],
        "points"=>$row["points_price"],
        "image"=>"http://fitnessfly.local/".$row["image_url"],
        "isPurchased"=>$row["is_purchased"] ? true : false,
        "calories" => intval($row["calories"])
    ];

}

echo json_encode($recipes);