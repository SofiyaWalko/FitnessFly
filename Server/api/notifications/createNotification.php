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

/* ======================
   PHPMailer
====================== */
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . "/../../libs/PHPMailer/Exception.php";
require __DIR__ . "/../../libs/PHPMailer/PHPMailer.php";
require __DIR__ . "/../../libs/PHPMailer/SMTP.php";

/* ======================
   ФУНКЦИЯ EMAIL
====================== */
function sendEmail($to, $title, $message)
{
    file_put_contents("D:/log.txt", "SEND TO: $to\n", FILE_APPEND);

    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'svalko940@gmail.com';
        $mail->Password = 'upkfaxbkaqomnjpt';
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;

        $mail->CharSet = 'UTF-8';

        $mail->setFrom('svalko940@gmail.com', 'FitnessFly');
        $mail->addAddress($to);

        $mail->isHTML(true);
        $mail->Subject = $title;

        $mail->Body = "
        <html>
        <body style='font-family: Arial;'>
            <h3>$title</h3>
            <p>$message</p>
        </body>
        </html>
        ";

        $mail->AltBody = $message;

        $mail->send();

        file_put_contents("D:/log.txt", "MAIL OK: $to\n", FILE_APPEND);

    } catch (Exception $e) {
        file_put_contents("D:/log.txt", "MAIL ERROR: " . $e->getMessage() . "\n", FILE_APPEND);
    }
}

/* ======================
   ФУНКЦИЯ TELEGRAM
====================== */
function sendTelegram($chat_id, $title, $message)
{
    $bot_token = "8700321886:AAHqNNCW2UY6j2M_eUu9XlOZZajRL5BmscY";
    $api_url = "https://api.telegram.org/bot$bot_token";

    $text = "🔔 $title\n\n$message";

    $url = "$api_url/sendMessage?chat_id=$chat_id&text=" . urlencode($text);

    $response = file_get_contents($url);

    file_put_contents("D:/log.txt", "TELEGRAM SENT TO: $chat_id - " . ($response ? "OK" : "ERROR") . "\n", FILE_APPEND);
}

/* ======================
   ПОЛУЧЕНИЕ ДАННЫХ
====================== */
$data = json_decode(file_get_contents("php://input"), true);

$title = isset($data['title']) ? mysqli_real_escape_string($link, $data['title']) : '';
$message = isset($data['message']) ? mysqli_real_escape_string($link, $data['message']) : '';

if (!$title || !$message) {
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
            $title,
            $message
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
            $title,
            $message
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