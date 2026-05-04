<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include "../../config.php";

$data = json_decode(file_get_contents("php://input"), true);

$user_id = isset($data["user_id"]) ? intval($data["user_id"]) : null;

if(!$user_id){
    echo json_encode(["status"=>"error","message"=>"Нет user_id"]);
    exit;
}

/* --- получаем город пользователя --- */

$query = "SELECT city FROM users_personal_info WHERE user_id = $user_id LIMIT 1";
$result = mysqli_query($link, $query);
$row = mysqli_fetch_assoc($result);

$city = $row["city"] ?? "Minsk";

/* --- API ключ --- */

$apiKey = "8f6fa5e6904f2920097ec393452467ac";

/* --- запрос к погоде --- */

$url = "https://api.openweathermap.org/data/2.5/weather?q=" 
. urlencode($city) 
. "&units=metric&lang=ru&appid=$apiKey";

$response = file_get_contents($url);

if(!$response){
    echo json_encode(["status"=>"error","message"=>"Ошибка получения погоды"]);
    exit;
}

$weatherData = json_decode($response, true);

if($weatherData["cod"] != 200){
    echo json_encode(["status"=>"error","message"=>"Город не найден"]);
    exit;
}

/* --- ответ --- */

echo json_encode([
    "status" => "success",
    "city" => $weatherData["name"],
    "temperature" => round($weatherData["main"]["temp"]),
    "description" => $weatherData["weather"][0]["description"],
    "icon" => $weatherData["weather"][0]["icon"]
]);