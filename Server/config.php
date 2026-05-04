<?php
    
    $host = "MySQL-8.4"; 
    $database = "FitnessFly";
    $user = "root"; 
    $password = ""; 
    $link = mysqli_connect($host, $user, $password, $database)
    or die("Ошибка ".mysqli_error($link));

    if (!mysqli_set_charset($link, "utf8mb4")) {
        echo "Ошибка при загрузке набора символов utf8mb4";
        mysqli_error($link);
        exit();
    }    
    mysqli_set_charset($link, "utf8mb4");

    
?>