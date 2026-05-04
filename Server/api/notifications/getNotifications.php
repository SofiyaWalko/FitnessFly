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
SELECT 
    n.id,
    n.title,
    n.message,
    n.created_at,
    un.is_read
FROM user_notifications un
JOIN notifications n ON n.id = un.notification_id
WHERE un.user_id = $user_id
ORDER BY n.created_at DESC
");

$notifications = [];

while($row = mysqli_fetch_assoc($res)){
    $notifications[] = [
        "id" => $row["id"],
        "title" => $row["title"],
        "message" => $row["message"],
        "date" => date("d.m.Y H:i", strtotime($row["created_at"])),
        "is_read" => (int)$row["is_read"]
    ];
}

echo json_encode($notifications);