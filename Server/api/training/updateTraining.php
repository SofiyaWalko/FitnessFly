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

$id = intval($_POST["id"]);
$title = $_POST["title"];

$id = intval($_POST["id"] ?? 0);
$title = trim($_POST["title"] ?? "");

$duration = intval($_POST["duration_minutes"] ?? 0);
$calories = intval($_POST["calories"] ?? 0);
$heart = intval($_POST["heart_rate"] ?? 0);
$points = intval($_POST["points_reward"] ?? -1);

/* ======================
   ВАЛИДАЦИЯ
====================== */
if (
	$id <= 0 ||
	$title === "" ||
	$duration <= 0 ||
	$calories <= 0 ||
	$heart <= 0 ||
	$points < 0
) {
	echo json_encode([
		"success" => false,
		"error" => "Некорректные данные"
	]);
	exit;
}

/* ======================
   ОБНОВЛЕНИЕ
====================== */
mysqli_query($link, "
UPDATE trainings SET
	title = '$title',
	duration_minutes = $duration,
	calories = $calories,
	heart_rate = $heart,
	points_reward = $points
WHERE id = $id
");

/* ======================
   ЕСЛИ НОВОЕ ВИДЕО
====================== */
if (isset($_FILES["video"])) {
	$videoName = time() . "_" . $_FILES["video"]["name"];
	move_uploaded_file(
		$_FILES["video"]["tmp_name"],
		"D:/Diplom/FitnessFly/Server/videos/" . $videoName
	);

	$video_url = "/videos/" . $videoName;

	mysqli_query($link, "
	UPDATE trainings SET video_url = '$video_url' WHERE id = $id
	");
}

/* ======================
   ЕСЛИ НОВОЕ ИЗОБРАЖЕНИЕ
====================== */
if (isset($_FILES["image"])) {
	$imageName = time() . "_" . $_FILES["image"]["name"];
	move_uploaded_file(
		$_FILES["image"]["tmp_name"],
		"D:/Diplom/FitnessFly/Server/images/trainings/" . $imageName
	);

	$image_url = "/images/trainings/" . $imageName;

	mysqli_query($link, "
	UPDATE trainings SET image_url = '$image_url' WHERE id = $id
	");
}

echo json_encode(["success" => true]);