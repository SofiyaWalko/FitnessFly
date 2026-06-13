<?php

file_put_contents("D:/log.txt", "\n=== CREATE NOTIFICATION START ===\n", FILE_APPEND);

ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include __DIR__ . "/../../config.php";

/* функции рассылки (Email + Telegram) и SMTP-настройки */
require_once __DIR__ . "/notifier.php";

/* ======================
   ПОЛУЧЕНИЕ ДАННЫХ
====================== */
$data = json_decode(file_get_contents("php://input"), true);

// сырой текст — для писем/телеграма; экранированный — только для SQL
$rawTitle = isset($data['title']) ? $data['title'] : '';
$rawMessage = isset($data['message']) ? $data['message'] : '';

$title = mysqli_real_escape_string($link, $rawTitle);
$message = mysqli_real_escape_string($link, $rawMessage);

if (!$rawTitle || !$rawMessage) {
    echo json_encode(["success" => false, "error" => "Нет данных"]);
    exit;
}

/* ======================
   СОЗДАНИЕ УВЕДОМЛЕНИЯ
====================== */
$insert = mysqli_query($link, "
INSERT INTO notifications (title, message, created_at)
VALUES ('$title', '$message', NOW())
");

if (!$insert) {
    file_put_contents("D:/log.txt", "SQL ERROR: " . mysqli_error($link) . "\n", FILE_APPEND);
    echo json_encode(["success" => false]);
    exit;
}

$notification_id = mysqli_insert_id($link);

file_put_contents("D:/log.txt", "CREATED NOTIFICATION ID: $notification_id\n", FILE_APPEND);

/* ======================
   ДОБАВЛЕНИЕ ВСЕМ ПОЛЬЗОВАТЕЛЯМ
====================== */
mysqli_query($link, "
INSERT INTO user_notifications (user_id, notification_id)
SELECT id, $notification_id FROM users
");

file_put_contents("D:/log.txt", "USER NOTIFICATIONS INSERTED\n", FILE_APPEND);

/* ======================
   EMAIL 
====================== */
$usersRes = mysqli_query($link, "
SELECT up.email
FROM users u
JOIN users_personal_info up ON up.user_id = u.id
JOIN user_notification_settings uns ON uns.user_id = u.id
WHERE uns.type_id = 1
AND up.email IS NOT NULL
AND up.email != ''
");

if (!$usersRes) {
    file_put_contents("D:/log.txt", "SQL USERS ERROR: " . mysqli_error($link) . "\n", FILE_APPEND);
} else {
    while ($user = mysqli_fetch_assoc($usersRes)) {
        sendEmail(
            $user['email'],
            $rawTitle,
            $rawMessage
        );
    }
}

/* ======================
   TELEGRAM
====================== */
$telegramUsersRes = mysqli_query($link, "
SELECT uns.telegram_id
FROM users u
JOIN user_notification_settings uns ON uns.user_id = u.id
WHERE uns.type_id = 2
AND uns.telegram_id IS NOT NULL
AND uns.telegram_id != ''
");

if (!$telegramUsersRes) {
    file_put_contents("D:/log.txt", "SQL TELEGRAM USERS ERROR: " . mysqli_error($link) . "\n", FILE_APPEND);
} else {
    while ($user = mysqli_fetch_assoc($telegramUsersRes)) {
        sendTelegram(
            $user['telegram_id'],
            $rawTitle,
            $rawMessage
        );
    }
}

/* ======================
   ОТВЕТ
====================== */
echo json_encode([
    "success" => true,
    "notification_id" => $notification_id
]);

file_put_contents("D:/log.txt", "=== END ===\n", FILE_APPEND);