<?php
header('Content-Type: application/json; charset=UTF-8');

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if($_SERVER['REQUEST_METHOD'] === 'OPTIONS'){
    exit;
}

include "../../config.php";

$data = json_decode(file_get_contents('php://input'), true);

if(!$data){
    echo json_encode(["error"=>"no data received"]);
    exit;
}

$user_id = isset($data['user_id']) ? intval($data['user_id']) : 0;
$height = isset($data['height']) ? intval($data['height']) : 0;
$weight = isset($data['weight']) ? intval($data['weight']) : 0;
$waist = isset($data['waist']) ? intval($data['waist']) : 0;
$chest = isset($data['chest']) ? intval($data['chest']) : 0;
$hips = isset($data['hips']) ? intval($data['hips']) : 0;
$activity = isset($data['activity']) ? intval($data['activity']) : 0;
$goal = isset($data['goal']) ? $data['goal'] : '';

/* перевод цели */

if($goal == "loss") $goal = "Снижение веса";
elseif($goal == "gain") $goal = "Набор веса";
elseif($goal == "maintain") $goal = "Поддержание веса";

if(!$user_id){
    echo json_encode(["error"=>"user_id missing"]);
    exit;
}

/* обновляем цель */

$query = "
UPDATE users_personal_info
SET goal='$goal'
WHERE user_id=$user_id
";

mysqli_query($link,$query);

/* добавляем параметры */

$query = "
INSERT INTO body_parameters
(user_id,weight,waist,chest,hips,height,activity_id)
VALUES
($user_id,$weight,$waist,$chest,$hips,$height,$activity)
";

mysqli_query($link,$query);

echo json_encode([
    "success"=>true
]);