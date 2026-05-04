<?php

file_put_contents("D:/log.txt", "SCRIPT START\n", FILE_APPEND);

ini_set('display_errors', 1);
error_reporting(E_ALL);

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
   ФУНКЦИЯ ОТПРАВКИ EMAIL
====================== */
function sendEmail($to, $title, $message)
{
    file_put_contents("D:/log.txt", "TRY SEND TO: $to\n", FILE_APPEND);

    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();

        // Включаем полный debug
        $mail->SMTPDebug = 2;
        $mail->Debugoutput = function($str, $level) {
            file_put_contents("D:/log.txt", $str . "\n", FILE_APPEND);
        };

        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'svalko940@gmail.com';
        $mail->Password = 'upkfaxbkaqomnjpt';
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;

        $mail->SMTPDebug = 3;
$mail->Debugoutput = function($str, $level) {
    file_put_contents("D:/log.txt", "SMTP DEBUG: $str\n", FILE_APPEND);
};

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
   ДАННЫЕ УВЕДОМЛЕНИЯ
====================== */

$title = "Контроль параметров";
$message = "Не забудьте сегодня измерить параметры тела";

/* ======================
   ПРОВЕРКА НА ЭТУ НЕДЕЛЮ
====================== */

$check = mysqli_query($link, "
SELECT id FROM notifications
WHERE YEARWEEK(created_at, 1) = YEARWEEK(NOW(), 1)
AND title = '$title'
LIMIT 1
");

if (!$check) {
    file_put_contents("D:/log.txt", "SQL ERROR: " . mysqli_error($link) . "\n", FILE_APPEND);
    exit;
}

if (mysqli_num_rows($check) == 0) {

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

    echo "ok";

} else {

    file_put_contents("D:/log.txt", "ALREADY EXISTS\n", FILE_APPEND);
    echo "already exists";
}