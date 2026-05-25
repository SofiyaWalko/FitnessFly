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

if (!$data) {
    $data = $_GET;
}

$program_id = isset($data['id']) ? intval($data['id']) : 0;
$user_id = isset($data['user_id']) ? intval($data['user_id']) : 0;

if (!$program_id) {
    echo json_encode(["error" => "No program id"]);
    exit;
}

/* ======================
   1. ПРОГРАММА + current_day
====================== */
$programQuery = "
SELECT 
    p.id,
    p.title,
    p.description,
    p.duration_days,
    p.difficulty_level,
    p.image_url,
    up.current_day
FROM programs p
LEFT JOIN user_programs up 
    ON up.program_id = p.id AND up.user_id = $user_id
WHERE p.id = $program_id
";

$programResult = mysqli_query($link, $programQuery);

if (!$programResult || mysqli_num_rows($programResult) === 0) {
    echo json_encode(["error" => "Program not found"]);
    exit;
}

$program = mysqli_fetch_assoc($programResult);

/* ======================
   2. ДНИ
====================== */
$daysQuery = "
SELECT id, day_number
FROM program_days
WHERE program_id = $program_id
ORDER BY day_number
";

$daysResult = mysqli_query($link, $daysQuery);

$days = [];

while ($day = mysqli_fetch_assoc($daysResult)) {

    $day_id = $day['id'];

    /* ======================
       3. ТРЕНИРОВКИ + completed
    ====================== */
$trainingsQuery = "
SELECT 
    t.id,
    t.title,
    t.duration_minutes,
    t.calories,
    t.heart_rate,
    t.points_reward,
    t.image_url,
    t.video_url,

    utp.id as completed,

    f.id as is_favorite

FROM program_day_trainings pdt

JOIN trainings t 
    ON t.id = pdt.training_id

LEFT JOIN user_programs up
    ON up.program_id = $program_id
    AND up.user_id = $user_id

LEFT JOIN user_program_day upd
    ON upd.user_program_id = up.id
    AND upd.day_id = pdt.program_day_id

LEFT JOIN user_training_progress utp
    ON utp.training_id = t.id
    AND utp.user_program_day_id = upd.id

LEFT JOIN favorites_tr f
    ON f.training_id = t.id
    AND f.user_id = $user_id

WHERE pdt.program_day_id = $day_id

ORDER BY pdt.order_number
";

    $trainingsResult = mysqli_query($link, $trainingsQuery);

    $trainings = [];

    while ($training = mysqli_fetch_assoc($trainingsResult)) {

        $training['image_url'] = $training['image_url']
            ? "http://fitnessfly.local" . $training['image_url']
            : null;

        $training['video_url'] = $training['video_url']
            ? "http://fitnessfly.local" . $training['video_url']
            : null;

        //флаг completed
        $training['completed'] = $training['completed'] ? true : false;
        $training['isFavorite'] = $training['is_favorite'] ? true : false;

        $trainings[] = $training;
    }

    $allCompleted = true;

foreach ($trainings as $t) {
    if (!$t['completed']) {
        $allCompleted = false;
        break;
    }
}

$days[] = [
    "day" => intval($day['day_number']),
    "trainings" => $trainings,
    "isCompleted" => $allCompleted
];
}

/* ======================
   4. ОТВЕТ
====================== */
$response = [
    "id" => $program['id'],
    "title" => $program['title'],
    "description" => $program['description'],
    "duration_days" => $program['duration_days'],
    "difficulty_level" => $program['difficulty_level'],
    "image_url" => "http://fitnessfly.local/" . $program['image_url'],
    "current_day" => $program['current_day'] ? intval($program['current_day']) : null,
    "days" => $days
];

echo json_encode($response, JSON_UNESCAPED_UNICODE);