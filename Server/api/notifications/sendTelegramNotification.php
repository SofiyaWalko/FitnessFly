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

/* ======================
   PHPMailer
====================== */
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require "../../libs/PHPMailer/Exception.php";
require "../../libs/PHPMailer/PHPMailer.php";
require "../../libs/PHPMailer/SMTP.php";

/* ======================
   ФУНКЦИЯ EMAIL
====================== */
function sendEmail($to, $title, $message)
{
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
        return true;

    } catch (Exception $e) {
        return false;
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

    return $response ? true : false;
}

$data = json_decode(file_get_contents("php://input"), true);

$title = isset($data['title']) ? mysqli_real_escape_string($link, $data['title']) : '';
$message = isset($data['message']) ? mysqli_real_escape_string($link, $data['message']) : '';

if (!$title || !$message) {
    echo json_encode(["success" => false, "error" => "Нет данных"]);
    exit;
}

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
        if (sendEmail($user['email'], $title, $message)) {
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
        if (sendTelegram($user['telegram_id'], $title, $message)) {
            $telegram_sent++;
        } else {
            $telegram_error++;
        }
    }
}

echo json_encode([
    "success" => true,
    "email_sent" => $email_sent,
    "email_error" => $email_error,
    "telegram_sent" => $telegram_sent,
    "telegram_error" => $telegram_error,
    "total_sent" => $email_sent + $telegram_sent
]);
