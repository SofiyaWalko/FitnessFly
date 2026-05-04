<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include "../../config.php";

/* ======================
   ДАННЫЕ
====================== */
$title = $_POST["title"];
$description = $_POST["description"];
$duration_days = intval($_POST["duration_days"]);
$difficulty_level = $_POST["difficulty_level"];
$category_id = intval($_POST["category_id"]);

$duration_days = intval($_POST["duration_days"]);

if ($duration_days < 1) {
    echo json_encode([
        "success" => false,
        "error" => "Некорректное количество дней"
    ]);
    exit;
}

/* ======================
   ФАЙЛ
====================== */
$uploadDir = "D:/Diplom/FitnessFly/Server/images/programs/";

$fileName = time() . "_" . $_FILES["image"]["name"];
$targetPath = $uploadDir . $fileName;

move_uploaded_file($_FILES["image"]["tmp_name"], $targetPath);

$image_url = "images/programs/" . $fileName;

/* ======================
   СОЗДАЁМ ПРОГРАММУ
====================== */
mysqli_query($link, "
INSERT INTO programs 
(title, description, duration_days, difficulty_level, image_url, category_id)
VALUES 
('$title', '$description', $duration_days, '$difficulty_level', '$image_url', $category_id)
");

$program_id = mysqli_insert_id($link);

/* ======================
   СОЗДАЁМ ДНИ
====================== */
for ($i = 1; $i <= $duration_days; $i++) {
    mysqli_query($link, "
    INSERT INTO program_days (program_id, day_number, is_rest_day)
    VALUES ($program_id, $i, 0)
    ");
}



echo json_encode(["success" => true]);