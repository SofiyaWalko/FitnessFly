<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include "../../config.php";

$data = json_decode(file_get_contents("php://input"), true);
$user_id = intval($data["user_id"]);

$res = mysqli_query($link, "
SELECT COUNT(*) as count
FROM user_notifications
WHERE user_id = $user_id AND is_read = 0
");

$row = mysqli_fetch_assoc($res);

echo json_encode([
    "count" => (int)$row["count"]
]);