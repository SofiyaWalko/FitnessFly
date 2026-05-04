<?php
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

include "../../config.php";

$data = json_decode(file_get_contents('php://input'), true);

$user_id = isset($data['user_id']) ? intval($data['user_id']) : null;

if(!$user_id){
    echo json_encode(["error"=>"user_id not provided"]);
    exit;
}

$query = "
SELECT 
    weight,
    height,
    chest,
    waist,
    hips
FROM body_parameters
WHERE user_id = $user_id
ORDER BY created_at DESC
LIMIT 1
";

$result = mysqli_query($link, $query);

if(!$result){
    echo json_encode(["error"=>"query error"]);
    exit;
}

$row = mysqli_fetch_assoc($result);

if(!$row){
    echo json_encode(["error"=>"no data"]);
    exit;
}

echo json_encode([
    "weight" => $row['weight'],
    "height" => $row['height'],
    "chest" => $row['chest'],
    "waist" => $row['waist'],
    "hips" => $row['hips']
]);