<?php

$host = "MySQL-8.4";
$database = "FitnessFly";
$user = "root";
$password = "";
$link = mysqli_connect($host, $user, $password, $database)
    or die("Ошибка " . mysqli_error($link));

if (!mysqli_set_charset($link, "utf8mb4")) {
    echo "Ошибка при загрузке набора символов utf8mb4";
    mysqli_error($link);
    exit();
}
mysqli_set_charset($link, "utf8mb4");

/* ======================
   SMTP (Gmail) — настройки почты
====================== */
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_USER', 'svalko940@gmail.com');
define('SMTP_PASS', 'пароль'); // пароль приложения Gmail
define('SMTP_SECURE', 'tls');
define('SMTP_PORT', 587);
define('SMTP_FROM_NAME', 'FitnessFly');

/* ======================
   Telegram
====================== */
define('TELEGRAM_BOT_TOKEN', '8700321886:AAHqNNCW2UY6j2M_eUu9XlOZZajRL5BmscY');
?>