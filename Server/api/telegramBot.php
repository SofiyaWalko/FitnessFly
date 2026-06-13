<?php

include __DIR__ . "/../config.php";

$bot_token = TELEGRAM_BOT_TOKEN;
$api_url = "https://api.telegram.org/bot$bot_token";

// Получаем offset из файла или начинаем с 0
$offset_file = __DIR__ . "/telegram_offset.txt";
$offset = file_exists($offset_file) ? intval(file_get_contents($offset_file)) : 0;

echo "Запуск бота...\n";
echo "Offset: $offset\n\n";

while (true) {
    // Получаем обновления
    $url = "$api_url/getUpdates?offset=$offset&timeout=30";
    $response = file_get_contents($url);

    if ($response === false) {
        echo "Ошибка получения данных от Telegram API\n";
        sleep(5);
        continue;
    }

    $data = json_decode($response, true);

    if (!$data || !isset($data['ok'])) {
        echo "Некорректный ответ от API\n";
        sleep(5);
        continue;
    }

    if ($data['ok'] && !empty($data['result'])) {
        foreach ($data['result'] as $update) {
            $offset = $update['update_id'] + 1;
            file_put_contents($offset_file, $offset);

            if (!isset($update['message']) || !isset($update['message']['chat']['id'])) {
                continue;
            }

            $chat_id = $update['message']['chat']['id'];
            $text = isset($update['message']['text']) ? $update['message']['text'] : '';

            // Получаем никнейм или имя пользователя из Telegram
            $tg_user = isset($update['message']['from']) ? $update['message']['from'] : null;
            $tg_username = '';
            if ($tg_user) {
                if (isset($tg_user['username'])) {
                    $tg_username = '@' . $tg_user['username'];
                } else {
                    $tg_username = $tg_user['first_name'] . (isset($tg_user['last_name']) ? ' ' . $tg_user['last_name'] : '');
                }
            }

            echo "Получено сообщение: $text от chat_id: $chat_id ($tg_username)\n";

            // Обработка команды /start
            if (strpos($text, '/start') === 0) {
                // Извлекаем user_id из команды: /start 123
                $parts = explode(' ', $text);
                $user_id = isset($parts[1]) ? intval($parts[1]) : null;

                if (!$user_id) {
                    $message = "Для подключения бота введите команду: /start ВАШ_ID\n\nВаш ID можно найти в настройках уведомлений на сайте.";
                } else {
                    // Проверяем существование пользователя
                    $check = mysqli_query($link, "
                        SELECT user_id FROM user_notification_settings 
                        WHERE user_id = $user_id
                        LIMIT 1
                    ");

                    if ($check && mysqli_num_rows($check) > 0) {
                        // Обновляем telegram_id, telegram_username И сразу переключаем тип уведомлений на Telegram (type_id = 2)
                        mysqli_query($link, "
                            UPDATE user_notification_settings
                            SET telegram_id = '$chat_id',
                                telegram_username = '$tg_username',
                                type_id = 2
                            WHERE user_id = $user_id
                        ");

                        $message = "✅ Бот успешно подключен к вашему аккаунту!\n\nУведомления в Telegram активированы.";
                    } else {
                        $message = "❌ Пользователь с ID $user_id не найден.\n\nПроверьте правильность ID в настройках профиля.";
                    }
                }

                // Отправляем ответ
                file_get_contents("$api_url/sendMessage?chat_id=$chat_id&text=" . urlencode($message));
                echo "Отправлено: $message\n\n";
            }
        }
    }

    // Небольшая пауза
    sleep(1);
}
