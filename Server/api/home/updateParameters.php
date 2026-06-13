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

$user_id = isset($data['user_id']) ? intval($data['user_id']) : 0;
$height = isset($data['height']) ? floatval($data['height']) : 0;
$weight = isset($data['weight']) ? floatval($data['weight']) : 0;
$waist = isset($data['waist']) ? floatval($data['waist']) : 0;
$chest = isset($data['chest']) ? floatval($data['chest']) : 0;
$hips = isset($data['hips']) ? floatval($data['hips']) : 0;

if(!$user_id){
    echo json_encode(["error"=>"user_id missing"]);
    exit;
}

$todayQuery = "
SELECT id FROM body_parameters 
WHERE user_id = $user_id 
AND DATE(created_at) = CURDATE()
LIMIT 1
";

$todayResult = mysqli_query($link, $todayQuery);

if(mysqli_num_rows($todayResult) > 0){
    echo json_encode([
        "success"=>false,
        "message"=>"Вы сегодня уже произвели измерение"
    ]);
    exit;
}

/* переносим уровень активности из последнего измерения,
   иначе нормы калорий и ИМТ обнулятся (нет activity_id) */
$activityRes = mysqli_query($link, "
SELECT activity_id FROM body_parameters
WHERE user_id = $user_id AND activity_id IS NOT NULL
ORDER BY created_at DESC
LIMIT 1
");

$activityRow = mysqli_fetch_assoc($activityRes);
$activity_id = $activityRow && $activityRow['activity_id'] !== null
    ? intval($activityRow['activity_id'])
    : null;

$activitySql = $activity_id !== null ? $activity_id : "NULL";

$query = "
INSERT INTO body_parameters
(user_id,weight,waist,chest,hips,height,activity_id)
VALUES
($user_id,$weight,$waist,$chest,$hips,$height,$activitySql)
";

mysqli_query($link,$query);

echo json_encode([
    "success"=>true
]);