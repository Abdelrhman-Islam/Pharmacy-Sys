<?php
require_once '../../cors.php';
require_once __DIR__ . '/../../config/db.php'; 


$data = json_decode(file_get_contents("php://input"), true);
$user_id = 1; // ده ييجي من التوكن (Session)
$product_id = $data['product_id'];
$qty = $data['quantity'] ?? 1;

// "حركة الأذكياء": لو المنتج موجود زود الكمية، لو مش موجود ضيفه
$sql = "INSERT INTO cart (user_id, product_id, quantity) 
        VALUES (?, ?, ?) 
        ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)";

$stmt = $connection->prepare($sql);
$stmt->bind_param("iii", $user_id, $product_id, $qty);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "تمت الإضافة للسلة"]);
} else {
    echo json_encode(["status" => "error", "message" => "فشل الإضافة"]);
}
?>