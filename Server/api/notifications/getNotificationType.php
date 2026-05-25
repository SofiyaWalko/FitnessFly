<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include "../../config.php";

$data = json_decode(file_get_contents("php://input"), true);
$user_id = intval($data["user_id"]);

$res = mysqli_query($link, "
SELECT nt.type
FROM user_notification_settings uns
JOIN notification_type nt ON nt.id = uns.type_id
WHERE uns.user_id = $user_id
LIMIT 1
");

$row = mysqli_fetch_assoc($res);

echo json_encode([
    "type" => $row ? $row["type"] : "email"
]);