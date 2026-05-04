<?php
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
include "../../config.php";

$data = json_decode(file_get_contents("php://input"), true);

$user_id = intval($data['user_id']);
$training_id = intval($data['training_id']);

if (!$user_id || !$training_id) {
    echo json_encode(["error" => "Missing data"]);
    exit;
}

/* ======================
   1. Найти user_program_day
====================== */
$query = "
SELECT upd.id as user_program_day_id
FROM user_program_day upd
JOIN user_programs up ON up.id = upd.user_program_id
JOIN program_day_trainings pdt ON pdt.program_day_id = upd.day_id
WHERE up.user_id = $user_id
AND pdt.training_id = $training_id
LIMIT 1
";

$res = mysqli_query($link, $query);

if (!$res || mysqli_num_rows($res) === 0) {
    echo json_encode(["error" => "Day not found"]);
    exit;
}

$row = mysqli_fetch_assoc($res);
$user_program_day_id = $row['user_program_day_id'];

/* ======================
   1.1 Проверка порядка тренировок
====================== */

// получаем текущий день программы
$dayRes = mysqli_query($link, "
SELECT day_id FROM user_program_day WHERE id = $user_program_day_id
");

$dayRow = mysqli_fetch_assoc($dayRes);
$day_id = $dayRow['day_id'];

// получаем порядок текущей тренировки
$orderRes = mysqli_query($link, "
SELECT order_number 
FROM program_day_trainings
WHERE program_day_id = $day_id
AND training_id = $training_id
LIMIT 1
");

$orderRow = mysqli_fetch_assoc($orderRes);
$currentOrder = intval($orderRow['order_number']);

// если это не первая тренировка — проверяем предыдущую
if ($currentOrder > 1) {

    // находим предыдущую тренировку
    $prevRes = mysqli_query($link, "
    SELECT training_id 
    FROM program_day_trainings
    WHERE program_day_id = $day_id
    AND order_number = " . ($currentOrder - 1) . "
    LIMIT 1
    ");

    $prevRow = mysqli_fetch_assoc($prevRes);
    $prevTrainingId = $prevRow['training_id'];

    // проверяем выполнена ли предыдущая
    $prevCheck = mysqli_query($link, "
    SELECT id FROM user_training_progress
    WHERE training_id = $prevTrainingId
    AND user_program_day_id = $user_program_day_id
    LIMIT 1
    ");

    if (!$prevCheck || mysqli_num_rows($prevCheck) === 0) {
        echo json_encode([
            "success" => false,
            "message" => "Сначала выполните предыдущую тренировку"
        ]);
        exit;
    }
}

/* ======================
   2. Проверка: не записано ли уже
====================== */
$check = mysqli_query($link, "
SELECT id FROM user_training_progress
WHERE training_id = $training_id
AND user_program_day_id = $user_program_day_id
LIMIT 1
");

if ($check && mysqli_num_rows($check) > 0) {
    echo json_encode(["message" => "Already completed"]);
    exit;
}

/* ======================
   3. Получить points тренировки
====================== */

$pointsRes = mysqli_query($link, "
SELECT points_reward FROM trainings WHERE id = $training_id LIMIT 1
");

$pointsRow = mysqli_fetch_assoc($pointsRes);
$points = intval($pointsRow['points_reward'] ?? 0);

/* ======================
   3. Записать тренировку
====================== */
mysqli_query($link, "
INSERT INTO user_training_progress 
(training_id, user_program_day_id, watched_percent, status, completed_at)
VALUES ($training_id, $user_program_day_id, 100, 'completed', NOW())
");

/* ======================
   3.1 Начислить points
====================== */

/* Проверяем есть ли запись */
$userPointsRes = mysqli_query($link, "
SELECT id, points FROM user_points WHERE user_id = $user_id LIMIT 1
");

if ($userPointsRes && mysqli_num_rows($userPointsRes) > 0) {

    $row = mysqli_fetch_assoc($userPointsRes);
    $newPoints = $row['points'] + $points;

    mysqli_query($link, "
    UPDATE user_points
    SET points = $newPoints, update_at = NOW()
    WHERE user_id = $user_id
    ");

} else {

    mysqli_query($link, "
    INSERT INTO user_points (user_id, points, created_at)
    VALUES ($user_id, $points, NOW())
    ");

}

/* ======================
   4. Проверить завершение дня
====================== */
$total = mysqli_query($link, "
SELECT COUNT(*) as total
FROM program_day_trainings
WHERE program_day_id = (
    SELECT day_id FROM user_program_day WHERE id = $user_program_day_id
)
");

$done = mysqli_query($link, "
SELECT COUNT(*) as done
FROM user_training_progress
WHERE user_program_day_id = $user_program_day_id
");

$totalCount = mysqli_fetch_assoc($total)['total'];
$doneCount = mysqli_fetch_assoc($done)['done'];

/* ======================
   5. Если день завершён
====================== */
if ($totalCount == $doneCount) {

    mysqli_query($link, "
    UPDATE user_program_day
    SET status = 'completed'
    WHERE id = $user_program_day_id
    ");

    mysqli_query($link, "
    UPDATE user_programs
    SET current_day = current_day + 1
    WHERE id = (
        SELECT user_program_id FROM user_program_day WHERE id = $user_program_day_id
    )
    ");
}

/* ======================
   6. Получить current_day
====================== */
$userProgramRes = mysqli_query($link, "
SELECT user_program_id FROM user_program_day WHERE id = $user_program_day_id
");

$user_program_id = mysqli_fetch_assoc($userProgramRes)['user_program_id'];

$currentDayRes = mysqli_query($link, "
SELECT current_day FROM user_programs WHERE id = $user_program_id
");

$current_day = mysqli_fetch_assoc($currentDayRes)['current_day'];

echo json_encode([
    "success" => true,
    "points_added" => $points,
    "day_completed" => ($totalCount == $doneCount),
    "new_current_day" => $current_day
]);