<?php
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

include "../../config.php";

$data = json_decode(file_get_contents('php://input'), true);

$user_id = isset($data['user_id']) ? intval($data['user_id']) : null;

$query = "
SELECT 
    p.id,
    p.title,
    p.description,
    p.duration_days,
    p.difficulty_level,
    p.image_url,
    c.category_name AS category,
    up.started_at,
    up.current_day
FROM programs p
JOIN categories c ON p.category_id = c.id
LEFT JOIN user_programs up 
    ON up.program_id = p.id " .
    ($user_id ? "AND up.user_id = $user_id" : "") . "
ORDER BY p.id DESC
LIMIT 4
";

$result = mysqli_query($link, $query);

$programs = [];

while ($row = mysqli_fetch_assoc($result)) {

    $row['image_url'] = "http://fitnessfly.local/" . $row['image_url'];

    $status = null;

    if ($user_id) {

        if (!$row['started_at']) {
            $status = "Не начата";
        }
        elseif ($row['current_day'] < $row['duration_days']) {
            $status = "В процессе";
        }
        elseif ($row['current_day'] == $row['duration_days']) {
            $status = "Завершена";
        }

    }

    $programs[] = [
        "id" => $row['id'],
        "title" => $row['title'],
        "duration_days" => $row['duration_days'],
        "difficulty_level" => $row['difficulty_level'],
        "image_url" => $row['image_url'],
        "status" => $status
    ];
}

echo json_encode($programs);