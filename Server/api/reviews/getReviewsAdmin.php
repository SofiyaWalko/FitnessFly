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
$filter = $data["filter"] ?? "all";

mysqli_query($link, "
UPDATE reviews 
SET is_seen = 1 
WHERE is_seen = 0
");

$where = "";

if ($filter === "published") {
    $where = "WHERE r.is_published = 1";
} elseif ($filter === "hidden") {
    $where = "WHERE r.is_published = 0";
}

$query = "
SELECT
    r.id,
    r.rating,
    r.message,
    r.created_at,
    r.is_published,
    p.title AS program,
    u.user_name AS name,
    up.photo_url
FROM reviews r
JOIN programs p ON r.program_id = p.id
JOIN users u ON r.user_id = u.id
JOIN users_personal_info up ON r.user_id = up.user_id
$where
ORDER BY r.created_at DESC
";

$result = mysqli_query($link, $query);

$reviews = [];

while ($row = mysqli_fetch_assoc($result)) {
    $reviews[] = [
        "id" => $row["id"],
        "name" => $row["name"],
        "program" => $row["program"],
        "rating" => (int)$row["rating"],
        "text" => $row["message"],
        "photo" => "http://fitnessfly.local/" . $row["photo_url"],
        "date" => date("d.m.Y", strtotime($row["created_at"])),
        "is_published" => (int)$row["is_published"]
    ];
}

echo json_encode($reviews);