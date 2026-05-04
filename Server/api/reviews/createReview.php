<?php
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include "../../config.php";

$data = json_decode(file_get_contents("php://input"), true);

$user_id = intval($data["user_id"]);
$program_id = intval($data["program_id"]);
$rating = intval($data["rating"]);
$message = mysqli_real_escape_string($link, $data["message"]);

$check = mysqli_query($link, "
SELECT id FROM reviews
WHERE user_id = $user_id AND program_id = $program_id
LIMIT 1
");

if (mysqli_num_rows($check) > 0) {
	echo json_encode([
		"success" => false,
		"message" => "Вы уже оставили отзыв"
	]);
	exit;
}

mysqli_query($link, "
INSERT INTO reviews (user_id, program_id, rating, message, is_published, is_seen)
VALUES ($user_id, $program_id, $rating, '$message', 0, 0)
");

echo json_encode(["success" => true]);