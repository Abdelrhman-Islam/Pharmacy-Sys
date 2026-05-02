<?php
require_once '../../cors.php';
require_once __DIR__ . '/../../config/db.php'; 

$connection->begin_transaction();

try {
    $data = json_decode(file_get_contents("php://input"), true);
    $user_id = $user['id']; // From middleware
    
    // 1. Save order details
    $stmt = $connection->prepare("INSERT INTO orders (user_id, total_amount, address, city, phone, notes) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("idssss", $user_id, $data['total'], $data['address'], $data['city'], $data['phone'], $data['notes']);
    $stmt->execute();
    $order_id = $connection->insert_id;

    // 2. Migrate cart items
    // ... [Order items & stock update] ...

    $connection->commit();
    echo json_encode(["status" => "success", "order_id" => $order_id]);

} catch (Exception $e) {
    $connection->rollback();
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}