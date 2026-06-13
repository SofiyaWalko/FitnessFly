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
$q = isset($data["q"]) ? trim($data["q"]) : "";

if ($q === "") {
    echo json_encode([]);
    exit();
}

$q = mysqli_real_escape_string($link, $q);

// Ищем существующие ингредиенты по названию (уникальные, без учёта регистра)
$query = "
SELECT name, MIN(quantity) AS quantity
FROM recipe_ingredients
WHERE name LIKE '%$q%'
GROUP BY name
ORDER BY
    CASE WHEN name LIKE '$q%' THEN 0 ELSE 1 END,
    name ASC
LIMIT 10
";

$res = mysqli_query($link, $query);

$items = [];
while ($row = mysqli_fetch_assoc($res)) {
    $items[] = [
        "name" => $row["name"],
        "quantity" => $row["quantity"],
    ];
}

echo json_encode($items);
