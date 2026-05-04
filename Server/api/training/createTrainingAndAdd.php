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

$title = trim($_POST["title"] ?? "");

$duration = intval($_POST["duration_minutes"] ?? 0);
$calories = intval($_POST["calories"] ?? 0);
$heart = intval($_POST["heart_rate"] ?? 0);
$points = intval($_POST["points_reward"] ?? -1); // важно!

$program_id = intval($_POST["program_id"] ?? 0);
$day_number = intval($_POST["day_number"] ?? 0);

/* ======================
   ВАЛИДАЦИЯ
====================== */
if (
	$title === "" ||
	$duration <= 0 ||
	$calories <= 0 ||
	$heart <= 0 ||
	$points < 0 || // баллы можно 0
	$program_id <= 0 ||
	$day_number <= 0
) {
	echo json_encode([
		"success" => false,
		"error" => "Некорректные данные"
	]);
	exit;
}

$program_id = intval($_POST["program_id"]);
$day_number = intval($_POST["day_number"]);

/* ======================
   ФАЙЛЫ
====================== */

// ПРОВЕРКА ВИДЕО
if (isset($_FILES["video"]) && $_FILES["video"]["error"] === 0) {
	$videoName = time() . "_" . $_FILES["video"]["name"];
	move_uploaded_file(
		$_FILES["video"]["tmp_name"],
		"D:/Diplom/FitnessFly/Server/videos/" . $videoName
	);
	$video_url = "/videos/" . $videoName;
} else {
	echo json_encode([
		"success" => false,
		"error" => "Видео не загружено"
	]);
	exit;
}

// ПРОВЕРКА КАРТИНКИ
if (isset($_FILES["image"]) && $_FILES["image"]["error"] === 0) {
	$imageName = time() . "_" . $_FILES["image"]["name"];
	move_uploaded_file(
		$_FILES["image"]["tmp_name"],
		"D:/Diplom/FitnessFly/Server/images/trainings/" . $imageName
	);
	$image_url = "/images/trainings/" . $imageName;
} else {
	echo json_encode([
		"success" => false,
		"error" => "Изображение не загружено"
	]);
	exit;
}

/* ======================
   СОЗДАЁМ ТРЕНИРОВКУ
====================== */
mysqli_query($link, "
INSERT INTO trainings 
(title, video_url, duration_minutes, calories, heart_rate, points_reward, image_url)
VALUES 
('$title', '$video_url', $duration, $calories, $heart, $points, '$image_url')
");

$training_id = mysqli_insert_id($link);

/* ======================
   НАЙТИ ДЕНЬ
====================== */
$res = mysqli_query($link, "
SELECT id FROM program_days 
WHERE program_id = $program_id AND day_number = $day_number
");

$row = mysqli_fetch_assoc($res);
$day_id = $row["id"];

/* ======================
   ORDER
====================== */
$res = mysqli_query($link, "
SELECT MAX(order_number) as max_order 
FROM program_day_trainings 
WHERE program_day_id = $day_id
");

$row = mysqli_fetch_assoc($res);
$order = ($row["max_order"] ?? 0) + 1;

/* ======================
   ПРИВЯЗКА
====================== */
mysqli_query($link, "
INSERT INTO program_day_trainings (program_day_id, training_id, order_number)
VALUES ($day_id, $training_id, $order)
");

echo json_encode(["success" => true]);