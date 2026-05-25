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
    u.gender,
    u.birth_day,
    u.goal,
    b.weight,
    b.height,
    a.activity_level
FROM users_personal_info u
LEFT JOIN (
    SELECT *
    FROM body_parameters
    WHERE user_id = $user_id
    ORDER BY created_at DESC
    LIMIT 1
) b ON b.user_id = u.user_id
LEFT JOIN activity_level a ON a.id = b.activity_id
WHERE u.user_id = $user_id
LIMIT 1
";

$result = mysqli_query($link, $query);

$row = mysqli_fetch_assoc($result);

if(!$row){
    echo json_encode(["error"=>"no data"]);
    exit;
}

$gender = $row['gender'];
$birth_day = $row['birth_day'];
$goal = $row['goal'];
$weight = floatval($row['weight']);
$height = floatval($row['height']);
$activity = $row['activity_level'];

/* ======================
   ПРОВЕРКА ДАННЫХ
====================== */

if(!$weight || !$height || !$activity){

    echo json_encode([
        "calories" => 0,
        "goal_note" => "Недостаточно данных",
        "water_ml" => 0,
        "water_glasses" => 0,
        "bmi" => 0,
        "bmi_note" => "Недостаточно данных"
    ]);

    exit;
}

/* ======================
   ВОЗРАСТ
====================== */

$birthDate = new DateTime($birth_day);
$today = new DateTime();
$age = $today->diff($birthDate)->y;

/* ======================
   BMR
====================== */

if($gender == "male"){
    $bmr = 88.36 + (13.4 * $weight) + (4.8 * $height) - (5.7 * $age);
}
else{
    $bmr = 447.6 + (9.2 * $weight) + (3.1 * $height) - (4.3 * $age);
}

/* ======================
   АКТИВНОСТЬ
====================== */

$mult = 1.2;

switch($activity){

    case "Сидячий образ жизни":
        $mult = 1.2;
        break;

    case "Небольшая активность":
        $mult = 1.375;
        break;

    case "Умеренная активность":
        $mult = 1.55;
        break;

    case "Высокая активность":
        $mult = 1.725;
        break;

    case "Очень высокая активность":
        $mult = 1.9;
        break;

}

/* ======================
   КАЛОРИИ
====================== */

$calories = $bmr * $mult;

/* ======================
   ЦЕЛЬ
====================== */

$goal_note = "Норма";

switch($goal){

    case "Снижение веса":
        $calories *= 0.85;
        $goal_note = "Дефицит 15%";
        break;

    case "Набор веса":
        $calories *= 1.15;
        $goal_note = "Профицит 15%";
        break;

}

/* ======================
   ВОДА
====================== */

$water_ml = $weight * 35;
$water_glasses = round($water_ml / 250);

/* ======================
   BMI
====================== */

$bmi = $weight / pow(($height / 100), 2);

$bmi_note = "";

if($bmi <= 16) $bmi_note = "Дефицит массы тела";
elseif($bmi <= 18.5) $bmi_note = "Недостаточная масса тела";
elseif($bmi <= 25) $bmi_note = "Норма";
elseif($bmi <= 30) $bmi_note = "Избыточная масса тела";
elseif($bmi <= 35) $bmi_note = "Ожирение 1 степени";
elseif($bmi <= 40) $bmi_note = "Ожирение 2 степени";
else $bmi_note = "Ожирение 3 степени";

/* ======================
   ОТВЕТ
====================== */

$response = [
    "calories" => round($calories),
    "goal_note" => $goal_note,
    "water_ml" => round($water_ml),
    "water_glasses" => $water_glasses,
    "bmi" => round($bmi,1),
    "bmi_note" => $bmi_note
];

echo json_encode($response);