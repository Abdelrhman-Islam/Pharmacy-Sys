<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

require_once __DIR__ . '/../../config/db.php'; 
require_once __DIR__ . '/../../middleware/admin_middleware.php';

confirmAdmin($connection); 

// Retrieve input data
$name = $_POST['name'] ?? null;
$category_id = $_POST['category_id'] ?? null;
$price = $_POST['price'] ?? null;
$qty = $_POST['qty'] ?? null;
$description = $_POST['description'] ?? '';

// Handle image upload
$pic_name = '';
if (isset($_FILES['pic']) && $_FILES['pic']['error'] === 0) {
    $upload_dir = '../../uploads/products/'; 
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }
    
    $extension = pathinfo($_FILES['pic']['name'], PATHINFO_EXTENSION);
    $pic_name = time() . '_' . uniqid() . '.' . $extension; 
    $upload_path = $upload_dir . $pic_name;
    
    move_uploaded_file($_FILES['pic']['tmp_name'], $upload_path);
}

if (!empty($name) && !empty($category_id) && !empty($price) && !empty($qty)) {
    try {
        $sql = "INSERT INTO products (category_id, name, description, price, qty, pic, created_at) 
                VALUES (:cat, :name, :desc, :price, :qty, :pic, NOW())";
        
        $stmt = $pdo->prepare($sql);
        
        $stmt->execute([
            'cat'   => $category_id,
            'name'  => $name,
            'desc'  => $description,
            'price' => $price,
            'qty'   => $qty,
            'pic'   => $pic_name 
        ]);

        echo json_encode(["status" => "success", "message" => "Product added successfully"]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Failed to add: " . $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Missing data"]);
}