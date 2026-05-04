<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit();
}

include "../../config.php";

$data = json_decode(file_get_contents("php://input"), true);

$user_id = intval($data["user_id"]);
$recipe_id = intval($data["recipe_id"]);

if (!$user_id || !$recipe_id) {
    echo json_encode(["error"=>"missing data"]);
    exit;
}

/* цена */
$res = mysqli_query($link, "
SELECT points_price FROM recipes WHERE id = $recipe_id
");

$row = mysqli_fetch_assoc($res);
$price = intval($row["points_price"]);

/* уже куплен */
$check = mysqli_query($link, "
SELECT id FROM recipes_purchases 
WHERE user_id=$user_id AND recipe_id=$recipe_id
LIMIT 1
");

if(mysqli_num_rows($check)>0){
    echo json_encode(["success"=>true]);
    exit;
}

/* баланс */
$pointsRes = mysqli_query($link, "
SELECT points FROM user_points WHERE user_id=$user_id
");

$pointsRow = mysqli_fetch_assoc($pointsRes);
$userPoints = intval($pointsRow["points"] ?? 0);

if($userPoints < $price){
    echo json_encode([
        "success"=>false,
        "message"=>"Недостаточно баллов"
    ]);
    exit;
}

/* списание */
$newPoints = $userPoints - $price;

mysqli_query($link,"
UPDATE user_points 
SET points=$newPoints, update_at=NOW()
WHERE user_id=$user_id
");

/* покупка */
mysqli_query($link,"
INSERT INTO recipes_purchases (user_id,recipe_id)
VALUES ($user_id,$recipe_id)
");

echo json_encode(["success"=>true]);