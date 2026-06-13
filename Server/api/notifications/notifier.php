<?php
/* ======================
   Общие функции рассылки (Email + Telegram).
   Настройки берутся из config.php (SMTP_* и TELEGRAM_BOT_TOKEN).
====================== */

require_once __DIR__ . "/../../config.php";

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . "/../../libs/PHPMailer/Exception.php";
require_once __DIR__ . "/../../libs/PHPMailer/PHPMailer.php";
require_once __DIR__ . "/../../libs/PHPMailer/SMTP.php";

if (!function_exists('sendEmail')) {
    /**
     * Отправка письма. Возвращает true при успехе, false при ошибке.
     */
    function sendEmail($to, $title, $message)
    {
        $mail = new PHPMailer(true);

        try {
            $mail->isSMTP();
            $mail->Host = SMTP_HOST;
            $mail->SMTPAuth = true;
            $mail->Username = SMTP_USER;
            $mail->Password = SMTP_PASS;
            $mail->SMTPSecure = SMTP_SECURE;
            $mail->Port = SMTP_PORT;

            $mail->CharSet = 'UTF-8';

            $mail->setFrom(SMTP_USER, SMTP_FROM_NAME);
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
}

if (!function_exists('sendTelegram')) {
    /**
     * Отправка сообщения в Telegram. Возвращает true при успехе, false при ошибке.
     */
    function sendTelegram($chat_id, $title, $message)
    {
        $api_url = "https://api.telegram.org/bot" . TELEGRAM_BOT_TOKEN;

        $text = "🔔 $title\n\n$message";

        $url = "$api_url/sendMessage?chat_id=$chat_id&text=" . urlencode($text);

        $response = @file_get_contents($url);

        return $response ? true : false;
    }
}
