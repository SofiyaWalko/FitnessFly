<?php

include "../../config.php";

$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (!$data) exit;

$chat_id = $data['message']['chat']['id'];
$text = $data['message']['text'];

/* если пользователь нажал /start */
if ($text === "/start") {   
    
    
    mysqli_query($link, "
    UPDATE user_notification_settings
    SET telegram_id = '$chat_id'
    WHERE user_id = 6
    ");

    file_get_contents("https://api.telegram.org/8700321886:AAHqNNCW2UY6j2M_eUu9XlOZZajRL5BmscY/sendMessage?chat_id=$chat_id&text=Бот подключен");
}