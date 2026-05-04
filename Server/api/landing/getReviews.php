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

$query = "
SELECT
    r.id,
    r.rating,
    r.message,
    r.created_at,
    p.title AS program,
    u.user_name AS name,
    up.photo_url
FROM reviews r
JOIN programs p ON r.program_id = p.id
JOIN users u ON r.user_id = u.id
JOIN users_personal_info up ON r.user_id = up.user_id

WHERE r.is_published = 1

ORDER BY r.created_at DESC
LIMIT 10
";

$result = mysqli_query($link, $query);

$reviews = [];

while ($row = mysqli_fetch_assoc($result)) {

    $row['photo_url'] = "http://fitnessfly.local/" . $row['photo_url'];

    $reviews[] = [
        "id" => $row['id'],
        "name" => $row['name'],
        "program" => $row['program'],
        "rating" => (int)$row['rating'],
        "text" => $row['message'],
        "photo" => $row['photo_url'],
        "date" => date("d.m.Y", strtotime($row['created_at']))
    ];
}

echo json_encode($reviews);