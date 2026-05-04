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

$email = strtolower(trim($data["email"] ?? ""));
$password = $data["password"] ?? "";

/* --- ВАЛИДАЦИЯ --- */

if($email === ""){
echo json_encode([
"status"=>"error",
"message"=>"Введите email"
]);
exit;
}

if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
echo json_encode([
"status"=>"error",
"message"=>"Некорректный email"
]);
exit;
}

if($password === ""){
echo json_encode([
"status"=>"error",
"message"=>"Введите пароль"
]);
exit;
}

if(strlen($password) < 8){
echo json_encode([
"status"=>"error",
"message"=>"Пароль должен содержать минимум 8 символов"
]);
exit;
}

/* --- ПОИСК ПОЛЬЗОВАТЕЛЯ --- */

$stmt = mysqli_prepare($link,"
SELECT u.id, u.password_hash, u.role
FROM users u
JOIN users_personal_info upi ON u.id = upi.user_id
WHERE upi.email = ?
");

if(!$stmt){
echo json_encode([
"status"=>"error",
"message"=>"Ошибка сервера"
]);
exit;
}

mysqli_stmt_bind_param($stmt,"s",$email);
mysqli_stmt_execute($stmt);

$result = mysqli_stmt_get_result($stmt);
$user = mysqli_fetch_assoc($result);

/* --- ПРОВЕРКА ПАРОЛЯ --- */

if($user && password_verify($password,$user["password_hash"])){

echo json_encode([
"status"=>"success",
"user_id"=>$user["id"],
"role"=>$user["role"]
]);

}else{

echo json_encode([
"status"=>"error",
"message"=>"Неверный email или пароль"
]);

}

mysqli_stmt_close($stmt);