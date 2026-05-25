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

/* ======================
   ЗАПРОС
====================== */
$query = "
SELECT 
    p.id,
    p.title,
    p.duration_days,
    p.difficulty_level,
    p.image_url,
    c.category_name AS category,

    (
        SELECT COUNT(*)
        FROM program_days pd
        WHERE pd.program_id = p.id
    ) AS total_days,

    (
        SELECT COUNT(DISTINCT pd.id)
        FROM program_days pd
        JOIN program_day_trainings pdt 
            ON pdt.program_day_id = pd.id
        WHERE pd.program_id = p.id
    ) AS filled_days

FROM programs p
JOIN categories c ON c.id = p.category_id

WHERE p.is_archived = 0

ORDER BY p.id DESC
";

$result = mysqli_query($link, $query);

if (!$result) {
    echo json_encode([
        "error" => "SQL error",
        "message" => mysqli_error($link)
    ]);
    exit;
}

$programs = [];

/* ======================
   ОБРАБОТКА
====================== */
while ($row = mysqli_fetch_assoc($result)) {

    $image = $row["image_url"]
        ? "http://fitnessfly.local/" . $row["image_url"]
        : null;

    // программа готова если все дни заполнены
    $isReady = $row["total_days"] == $row["filled_days"] && $row["total_days"] > 0;

    $programs[] = [
        "id" => $row["id"],
        "title" => $row["title"],
        "duration_days" => $row["duration_days"],
        "difficulty_level" => $row["difficulty_level"],
        "image_url" => $image,
        "isReady" => $isReady,
        "status" => $isReady ? "Готова" : "Не готова",
        "category" => $row["category"] 
    ];
}

echo json_encode($programs, JSON_UNESCAPED_UNICODE);