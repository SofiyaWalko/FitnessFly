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

$email = trim($data["email"]);

/* ======================
   ВАЛИДАЦИЯ EMAIL
====================== */
if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
    echo json_encode(["exists" => false]);
    exit;
}

/* ======================
   ПРОВЕРКА EMAIL В БД
====================== */
$check = mysqli_query($link, "SELECT id FROM users_personal_info WHERE email='$email'");

if(mysqli_num_rows($check) > 0){
    echo json_encode(["exists" => true]);
} else {
    echo json_encode(["exists" => false]);
}
