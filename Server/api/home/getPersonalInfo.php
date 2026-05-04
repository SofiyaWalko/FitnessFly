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

/* функция склонения возраста */

function ageText($age){

    $age = abs($age) % 100;
    $age1 = $age % 10;

    if ($age > 10 && $age < 20) return $age . " лет";
    if ($age1 > 1 && $age1 < 5) return $age . " года";
    if ($age1 == 1) return $age . " год";

    return $age . " лет";
}

$query = "
SELECT 
    u.user_name,
    p.birth_day,
    p.goal,
    p.photo_url,
    COALESCE(up.points,0) AS points
FROM users u
JOIN users_personal_info p ON p.user_id = u.id
LEFT JOIN user_points up ON up.user_id = u.id
WHERE u.id = $user_id
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

/* возраст */

$birth_day = $row['birth_day'];

$birthDate = new DateTime($birth_day);
$today = new DateTime();

$age = $today->diff($birthDate)->y;
$age_text = ageText($age);

/* цель */

$goal_text = $row['goal'];

/* фото */

$photo = null;

if($row['photo_url']){
    $photo = "http://fitnessfly.local/" . $row['photo_url'];
}

/* ответ */

$response = [
    "name" => $row['user_name'],
    "age" => $age_text,
    "goal" => $goal_text,
    "points" => intval($row['points']),
    "photo" => $photo
];

echo json_encode($response);