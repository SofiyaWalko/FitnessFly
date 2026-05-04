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

$res = mysqli_query($link, "
SELECT COUNT(*) as count
FROM reviews
WHERE is_seen = 0
");

$row = mysqli_fetch_assoc($res);

echo json_encode([
    "count" => intval($row["count"])
]);