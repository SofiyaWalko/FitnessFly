<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include "../../config.php";

/* функции рассылки (Email + Telegram) и SMTP-настройки */
require_once __DIR__ . "/notifier.php";

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
   УВЕДОМЛЕНИЕ НА САЙТЕ
   (запись в центр уведомлений всем пользователям)
====================== */
mysqli_query($link, "
INSERT INTO notifications (title, message, created_at)
VALUES ('$title', '$message', NOW())
");

$notification_id = mysqli_insert_id($link);

mysqli_query($link, "
INSERT INTO user_notifications (user_id, notification_id)
SELECT id, $notification_id FROM users
");

/* ======================
   EMAIL ПОЛЬЗОВАТЕЛИ
====================== */
$emailUsersRes = mysqli_query($link, "
SELECT up.email
FROM users u
JOIN users_personal_info up ON up.user_id = u.id
JOIN user_notification_settings uns ON uns.user_id = u.id
WHERE uns.type_id = 1
AND up.email IS NOT NULL
AND up.email != ''
");

$email_sent = 0;
$email_error = 0;

if ($emailUsersRes) {
    while ($user = mysqli_fetch_assoc($emailUsersRes)) {
        if (sendEmail($user['email'], $rawTitle, $rawMessage)) {
            $email_sent++;
        } else {
            $email_error++;
        }
    }
}

/* ======================
   TELEGRAM ПОЛЬЗОВАТЕЛИ
====================== */
$telegramUsersRes = mysqli_query($link, "
SELECT uns.telegram_id
FROM users u
JOIN user_notification_settings uns ON uns.user_id = u.id
WHERE uns.type_id = 2
AND uns.telegram_id IS NOT NULL
AND uns.telegram_id != ''
");

$telegram_sent = 0;
$telegram_error = 0;

if ($telegramUsersRes) {
    while ($user = mysqli_fetch_assoc($telegramUsersRes)) {
        if (sendTelegram($user['telegram_id'], $rawTitle, $rawMessage)) {
            $telegram_sent++;
        } else {
            $telegram_error++;
        }
    }
}

echo json_encode([
    "success" => true,
    "notification_id" => $notification_id,
    "email_sent" => $email_sent,
    "email_error" => $email_error,
    "telegram_sent" => $telegram_sent,
    "telegram_error" => $telegram_error,
    "total_sent" => $email_sent + $telegram_sent
]);
