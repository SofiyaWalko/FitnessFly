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

$data = json_decode(file_get_contents("php://input"), true);

$user_id = intval($data["user_id"]);

$query = "
SELECT t.*
FROM favorites_tr f
JOIN trainings t ON t.id = f.training_id
WHERE f.user_id = $user_id
ORDER BY f.id DESC
";

$result = mysqli_query($link,$query);

$trainings = [];

while($row = mysqli_fetch_assoc($result)){
  $trainings[] = [
    "id" => $row["id"],
    "title" => $row["title"],
    "image" => "http://fitnessfly.local" . $row["image_url"],
    "time" => $row["duration_minutes"],
    "calories" => $row["calories"],
    "points" => $row["points_reward"],
    "heartRate" => $row["heart_rate"],
    "video_url" => "http://fitnessfly.local" . $row["video_url"],
    "completed" => true
];
}

echo json_encode($trainings);