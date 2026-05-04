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

$user_id = intval($data['user_id']);

$query = "
SELECT id, weight, waist, chest, hips, height, created_at
FROM body_parameters
WHERE user_id = $user_id
ORDER BY created_at DESC
";

$result = mysqli_query($link,$query);

$items = [];

while($row = mysqli_fetch_assoc($result)){
    $items[] = $row;
}

echo json_encode($items);