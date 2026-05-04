<?php

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
http_response_code(200);
exit();
}

include "../../config.php";

$data = json_decode(file_get_contents("php://input"), true);

$user_name = trim($data["name"]);
$password = $data["password"];
$email = trim($data["email"]);
$phone = $data["phone"];
$notify = $data["notify"];

$gender = $data["gender"];
$birthday = $data["birthday"];
$goal = $data["goal"];

$weight = $data["weight"];
$waist = $data["waist"];
$chest = $data["chest"];
$hips = $data["hips"];
$height = $data["height"];
$activity = intval($data["activity"]);

if(strlen($password) < 8){
echo json_encode(["status"=>"error","message"=>"Пароль слишком короткий"]);
exit;
}

if(!filter_var($email,FILTER_VALIDATE_EMAIL)){
echo json_encode(["status"=>"error","message"=>"Некорректный email"]);
exit;
}

if(!preg_match("/^\+375[0-9]{9}$/",$phone)){
echo json_encode(["status"=>"error","message"=>"Некорректный телефон"]);
exit;
}

$allowed_goals = [
"Снижение веса",
"Поддержание веса",
"Набор веса"
];

if(!in_array($goal,$allowed_goals)){
echo json_encode(["status"=>"error","message"=>"Некорректная цель"]);
exit;
}

if($activity < 1 || $activity > 5){
echo json_encode(["status"=>"error","message"=>"Некорректный уровень активности"]);
exit;
}

$password_hash = password_hash($password,PASSWORD_DEFAULT);

mysqli_begin_transaction($link);

try{

// // проверка логина
// $query="SELECT id FROM users WHERE user_name='$user_name'";
// $result=mysqli_query($link,$query);

// if(mysqli_num_rows($result)>0){

// echo json_encode([
// "status"=>"error",
// "message"=>"Логин уже существует"
// ]);
// exit;

// }

// проверка email
$query="SELECT id FROM users_personal_info WHERE email='$email'";
$result=mysqli_query($link,$query);

if(mysqli_num_rows($result)>0){

echo json_encode([
"status"=>"error",
"message"=>"Email уже зарегистрирован"
]);
exit;

}

// users
$query="
INSERT INTO users (user_name,password_hash,role)
VALUES ('$user_name','$password_hash',2)
";

mysqli_query($link,$query);

$user_id=mysqli_insert_id($link);


// users_personal_info
$query="
INSERT INTO users_personal_info
(user_id,gender,birth_day,goal,phone,email,created_at)
VALUES
('$user_id','$gender','$birthday','$goal','$phone','$email',NOW())
";

mysqli_query($link,$query);


// body_parametrs
$query="
INSERT INTO body_parameters
(user_id,weight,waist,chest,hips,height,activity_id,created_at)
VALUES
('$user_id','$weight','$waist','$chest','$hips','$height','$activity',NOW())
";

mysqli_query($link,$query);


// уведомления
$type_id = ($notify === "telegram") ? 2 : 1;

$query="
INSERT INTO user_notification_settings
(user_id,type_id)
VALUES
('$user_id','$type_id')
";

mysqli_query($link,$query);

mysqli_commit($link);

echo json_encode([
"status"=>"success",
"user_id"=>$user_id
]);

}catch(Exception $e){

mysqli_rollback($link);

echo json_encode([
"status"=>"error",
"message"=>$e->getMessage()
]);

}