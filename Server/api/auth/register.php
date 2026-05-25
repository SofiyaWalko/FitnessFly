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

/* ======================
   ОБЯЗАТЕЛЬНЫЕ
====================== */
$user_name = trim($data["name"]);
$password = $data["password"];
$email = trim($data["email"]);
$phone = $data["phone"];
$notify = $data["notify"];

$gender = $data["gender"];
$birthday = $data["birthday"];

/* ======================
   НЕОБЯЗАТЕЛЬНЫЕ
====================== */

// goal → NULL если не выбран
$goal = isset($data["goal"]) && $data["goal"] !== ""
    ? mysqli_real_escape_string($link, $data["goal"])
    : null;

// activity → NULL если не выбран
$activity = isset($data["activity"]) && $data["activity"] != 0
    ? intval($data["activity"])
    : null;

/* ======================
   ЧИСЛОВЫЕ
====================== */
$weight = intval($data["weight"] ?? 0);
$waist  = intval($data["waist"] ?? 0);
$chest  = intval($data["chest"] ?? 0);
$hips   = intval($data["hips"] ?? 0);
$height = intval($data["height"] ?? 0);

/* ======================
   ВАЛИДАЦИЯ
====================== */

if (!$gender) {
    echo json_encode(["status"=>"error","message"=>"Не указан пол"]);
    exit;
}

if (!$birthday) {
    echo json_encode(["status"=>"error","message"=>"Не указана дата рождения"]);
    exit;
}

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

/* ======================
   ПРОВЕРКА GOAL
====================== */
$allowed_goals = [
    "Снижение веса",
    "Поддержание веса",
    "Набор веса"
];

if($goal !== null && !in_array($goal,$allowed_goals)){
    echo json_encode(["status"=>"error","message"=>"Некорректная цель"]);
    exit;
}

/* ======================
   ПРОВЕРКА ACTIVITY
====================== */
if($activity !== null && ($activity < 1 || $activity > 5)){
    echo json_encode(["status"=>"error","message"=>"Некорректный уровень активности"]);
    exit;
}

/* ======================
   ХЭШ ПАРОЛЯ
====================== */
$password_hash = password_hash($password,PASSWORD_DEFAULT);

mysqli_begin_transaction($link);

try{

    /* ======================
       ПРОВЕРКА EMAIL
    ====================== */
    $check = mysqli_query($link,"SELECT id FROM users_personal_info WHERE email='$email'");

    if(mysqli_num_rows($check) > 0){
        echo json_encode([
            "status"=>"error",
            "message"=>"Email уже зарегистрирован"
        ]);
        exit;
    }

    /* ======================
       USERS
    ====================== */
    mysqli_query($link,"
        INSERT INTO users (user_name,password_hash,role)
        VALUES ('$user_name','$password_hash',2)
    ");

    $user_id = mysqli_insert_id($link);

    /* ======================
       SQL значения (NULL)
    ====================== */
    $goal_sql = $goal === null ? "NULL" : "'$goal'";
    $activity_sql = $activity === null ? "NULL" : $activity;

    /* ======================
       PERSONAL INFO
    ====================== */
    mysqli_query($link,"
        INSERT INTO users_personal_info
        (user_id,gender,birth_day,goal,phone,email,created_at)
        VALUES
        ('$user_id','$gender','$birthday',$goal_sql,'$phone','$email',NOW())
    ");

    /* ======================
       BODY PARAMETERS
    ====================== */
    mysqli_query($link,"
        INSERT INTO body_parameters
        (user_id,weight,waist,chest,hips,height,activity_id,created_at)
        VALUES
        ('$user_id','$weight','$waist','$chest','$hips','$height',$activity_sql,NOW())
    ");

    /* ======================
       УВЕДОМЛЕНИЯ
    ====================== */
    $type_id = ($notify === "telegram") ? 2 : 1;

    mysqli_query($link,"
        INSERT INTO user_notification_settings (user_id,type_id)
        VALUES ('$user_id','$type_id')
    ");

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