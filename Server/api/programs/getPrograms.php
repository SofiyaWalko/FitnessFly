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
    up.current_day,

    -- выполненные дни
    (
        SELECT COUNT(*)
        FROM user_program_day upd2
        WHERE upd2.user_program_id = up.id
        AND upd2.status = 'completed'
    ) AS completed_days,

    -- всего дней
    (
        SELECT COUNT(*)
        FROM program_days pd
        WHERE pd.program_id = p.id
    ) AS total_days,

    -- дней с тренировками
    (
        SELECT COUNT(DISTINCT pd.id)
        FROM program_days pd
        JOIN program_day_trainings pdt 
            ON pdt.program_day_id = pd.id
        WHERE pd.program_id = p.id
    ) AS filled_days

FROM programs p
JOIN categories c ON p.category_id = c.id

LEFT JOIN user_programs up 
    ON up.program_id = p.id
    AND up.user_id = $user_id

WHERE p.is_archived = 0

-- фильтр
HAVING total_days = filled_days

ORDER BY p.id DESC
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
elseif ($row['completed_days'] == $row['duration_days']) {
    $status = "Завершена";
}
else {
    $status = "В процессе";
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