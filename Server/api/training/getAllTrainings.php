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

$result = mysqli_query($link, "
SELECT 
    id,
    title,
    image_url,
    duration_minutes,
    calories,
    heart_rate,
    points_reward
FROM trainings
WHERE is_archived = 0 OR is_archived IS NULL
ORDER BY id DESC
");

$trainings = [];

while ($row = mysqli_fetch_assoc($result)) {
    $trainings[] = [
    "id" => $row["id"],
    "title" => $row["title"],
    "image_url" => "http://fitnessfly.local" . $row["image_url"],
    "duration_minutes" => $row["duration_minutes"],
    "calories" => $row["calories"],
    "heart_rate" => $row["heart_rate"],
    "points_reward" => $row["points_reward"]
];
}

echo json_encode($trainings);