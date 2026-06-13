<?php

file_put_contents("D:/log.txt", "SCRIPT START\n", FILE_APPEND);

ini_set('display_errors', 1);
error_reporting(E_ALL);

include __DIR__ . "/../../config.php";

/* функции рассылки (Email + Telegram) и SMTP-настройки */
require_once __DIR__ . "/notifier.php";

/* ======================
   ДАННЫЕ УВЕДОМЛЕНИЯ
====================== */

$title = "Контроль параметров";
$message = "Не забудьте сегодня измерить параметры тела";

/* ======================
   ПРОВЕРКА НА ЭТУ НЕДЕЛЮ (ВРЕМЕННО ОТКЛЮЧЕНО)
====================== */

// $check = mysqli_query($link, "
// SELECT id FROM notifications
// WHERE YEARWEEK(created_at, 1) = YEARWEEK(NOW(), 1)
// AND title = '$title'
// LIMIT 1
// ");

// if (!$check) {
//     file_put_contents("D:/log.txt", "SQL ERROR: " . mysqli_error($link) . "\n", FILE_APPEND);
//     exit;
// }

// if (mysqli_num_rows($check) == 0) {

file_put_contents("D:/log.txt", "WEEKLY CHECK DISABLED - PROCEEDING\n", FILE_APPEND);

file_put_contents("D:/log.txt", "CREATING NOTIFICATION\n", FILE_APPEND);

mysqli_query($link, "
    INSERT INTO notifications (title, message, created_at)
    VALUES ('$title', '$message', NOW())
    ");

$notification_id = mysqli_insert_id($link);

mysqli_query($link, "
    INSERT IGNORE INTO user_notifications (user_id, notification_id)
    SELECT id, $notification_id FROM users
    ");

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
    file_put_contents("D:/log.txt", "SQL ERROR USERS: " . mysqli_error($link) . "\n", FILE_APPEND);
    exit;
}

while ($user = mysqli_fetch_assoc($usersRes)) {

    sendEmail(
        $user['email'],
        $title,
        $message
    );
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
            $title,
            $message
        );
    }
}

echo "ok";

// } else {
//
//     file_put_contents("D:/log.txt", "ALREADY EXISTS\n", FILE_APPEND);
//     echo "already exists";
// }