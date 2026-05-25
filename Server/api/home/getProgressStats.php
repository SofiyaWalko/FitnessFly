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
    waist,
    chest,
    hips,
    created_at
FROM body_parameters
WHERE user_id = $user_id
ORDER BY created_at ASC
";

$result = mysqli_query($link,$query);

$stats = [];

while($row = mysqli_fetch_assoc($result)){

    $stats[] = [
        "date"=>$row['created_at'], // 🔥 теперь полная дата
        "weight"=>floatval($row['weight']),
        "waist"=>floatval($row['waist']),
        "chest"=>floatval($row['chest']),
        "hips"=>floatval($row['hips'])
    ];

}

echo json_encode($stats);