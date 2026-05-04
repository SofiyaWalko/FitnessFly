<?php
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

include "../../config.php";

$user_id = isset($_POST['user_id']) ? intval($_POST['user_id']) : null;

if(!$user_id){
    echo json_encode(["error"=>"user_id not provided"]);
    exit;
}

if(!isset($_FILES['photo'])){
    echo json_encode(["error"=>"file not provided"]);
    exit;
}

$file = $_FILES['photo'];

$allowed = ["jpg","jpeg","png","webp"];
$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

if(!in_array($ext,$allowed)){
    echo json_encode(["error"=>"invalid file type"]);
    exit;
}

if($file['size'] > 2*1024*1024){
    echo json_encode(["error"=>"file too large"]);
    exit;
}

/* получаем старое фото */

$query = "
SELECT photo_url 
FROM users_personal_info 
WHERE user_id = $user_id
";

$result = mysqli_query($link,$query);
$row = mysqli_fetch_assoc($result);

if($row && $row['photo_url']){

    $old_path = "../../" . $row['photo_url'];

    if(file_exists($old_path)){
        unlink($old_path);
    }
}

/* папка загрузки */

$upload_dir = "../../images/users/";

if(!file_exists($upload_dir)){
    mkdir($upload_dir,0777,true);
}

/* имя файла */

$file_name = "user_" . $user_id . "_" . time() . "." . $ext;
$path = $upload_dir . $file_name;

if(!move_uploaded_file($file['tmp_name'],$path)){
    echo json_encode(["error"=>"upload failed"]);
    exit;
}

$image_url = "images/users/" . $file_name;

/* обновляем БД */

$query = "
UPDATE users_personal_info
SET photo_url = '$image_url'
WHERE user_id = $user_id
";

mysqli_query($link,$query);

echo json_encode([
    "success"=>true,
    "photo"=>"http://fitnessfly.local/".$image_url
]);