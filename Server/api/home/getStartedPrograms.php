<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include "../../config.php";

$data = json_decode(file_get_contents("php://input"), true);

$user_id = isset($data["user_id"]) ? intval($data["user_id"]) : null;

if(!$user_id){
    echo json_encode(["error"=>"user_id not provided"]);
    exit;
}

$query = "
SELECT
    p.id,
    p.title,
    p.duration_days,
    p.difficulty_level,
    p.image_url,

    (
        SELECT COUNT(*)
        FROM user_program_day upd
        WHERE upd.user_program_id = up.id
        AND upd.status = 'completed'
    ) AS completed_days

FROM user_programs up
JOIN programs p ON p.id = up.program_id

WHERE up.user_id = $user_id
AND up.started_at IS NOT NULL

HAVING completed_days < p.duration_days

ORDER BY up.started_at DESC
";

$result = mysqli_query($link,$query);

$programs = [];

while($row = mysqli_fetch_assoc($result)){

    $programs[] = [
        "id"=>$row["id"],
        "title"=>$row["title"],
        "duration_days"=>$row["duration_days"],
        "difficulty_level"=>$row["difficulty_level"],
        "image_url"=>"http://fitnessfly.local/".$row["image_url"],
        "status"=>"В процессе"
    ];

}

echo json_encode($programs);