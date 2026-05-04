<?php

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if($_SERVER['REQUEST_METHOD'] === 'OPTIONS'){
    exit;
}

include "../../config.php";

$data = json_decode(file_get_contents('php://input'), true);

$id = intval($data['id']);

$height = floatval($data['height']);
$weight = floatval($data['weight']);
$waist = floatval($data['waist']);
$chest = floatval($data['chest']);
$hips = floatval($data['hips']);

$query = "
UPDATE body_parameters
SET 
    weight = $weight,
    waist = $waist,
    chest = $chest,
    hips = $hips,
    height = $height
WHERE id = $id
";

mysqli_query($link,$query);

echo json_encode(["success"=>true]);