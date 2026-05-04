<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

include "../../config.php";

$id = intval($_POST["id"]);
$title = $_POST["title"];
$description = $_POST["description"];
$duration_days = intval($_POST["duration_days"]);
$difficulty_level = $_POST["difficulty_level"];
$category_id = intval($_POST["category_id"]);

if ($duration_days < 1) {
    echo json_encode([
        "success" => false,
        "error" => "Некорректное количество дней"
    ]);
    exit;
}

/* ======================
   ОБНОВЛЯЕМ ПРОГРАММУ
====================== */
mysqli_query($link, "
UPDATE programs SET
	title = '$title',
	description = '$description',
	duration_days = $duration_days,
	difficulty_level = '$difficulty_level',
	category_id = $category_id
WHERE id = $id
");

/* ======================
   ПОЛУЧАЕМ ТЕКУЩЕЕ КОЛ-ВО ДНЕЙ
====================== */
$result = mysqli_query($link, "
SELECT COUNT(*) as total 
FROM program_days 
WHERE program_id = $id
");

$row = mysqli_fetch_assoc($result);
$current_days = intval($row["total"]);

/* ======================
   ЕСЛИ УВЕЛИЧИЛИ → ДОБАВЛЯЕМ
====================== */
if ($duration_days > $current_days) {
    for ($i = $current_days + 1; $i <= $duration_days; $i++) {
        mysqli_query($link, "
        INSERT INTO program_days (program_id, day_number, is_rest_day)
        VALUES ($id, $i, 0)
        ");
    }
}

/* ======================
   ЕСЛИ УМЕНЬШИЛИ → УДАЛЯЕМ
====================== */
if ($duration_days < $current_days) {

    $result = mysqli_query($link, "
    SELECT id FROM program_days 
    WHERE program_id = $id 
    AND day_number > $duration_days
    ");

    while ($row = mysqli_fetch_assoc($result)) {
        $day_id = $row["id"];

        // удаляем тренировки дня
        mysqli_query($link, "
        DELETE FROM program_day_trainings 
        WHERE program_day_id = $day_id
        ");

        // удаляем сам день
        mysqli_query($link, "
        DELETE FROM program_days 
        WHERE id = $day_id
        ");
    }
}

/* ======================
   ЕСЛИ НОВОЕ ИЗОБРАЖЕНИЕ
====================== */
if (isset($_FILES["image"])) {
	$uploadDir = "D:/Diplom/FitnessFly/Server/images/programs/";

	$fileName = time() . "_" . $_FILES["image"]["name"];
	move_uploaded_file($_FILES["image"]["tmp_name"], $uploadDir . $fileName);

	$image_url = "images/programs/" . $fileName;

	mysqli_query($link, "
	UPDATE programs SET image_url = '$image_url' WHERE id = $id
	");
}

echo json_encode(["success" => true]);