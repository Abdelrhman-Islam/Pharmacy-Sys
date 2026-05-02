<?php
// Setup CORS and DB
require_once '../../cors.php';
require_once __DIR__ . '/../../config/db.php'; 

// Receive JSON input
$json = file_get_contents("php://input");
$data = json_decode($json, true);

if (!$data) {
    echo json_encode(["status" => "error", "message" => "Invalid request data"]);
    exit;
}

// Start transaction
$connection->begin_transaction();

try {
    // 1. Insert order
    // Temporary user_id
    $user_id = 1; 
    $stmt = $connection->prepare("INSERT INTO orders (user_id, total_amount, address, phone, city) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("idsss", $user_id, $data['total'], $data['address'], $data['phone'], $data['city']);
    $stmt->execute();
    $order_id = $connection->insert_id;

    // 2. Insert items and update stock
    foreach ($data['cartItems'] as $item) {
        // Insert order item
        $stmt_item = $connection->prepare("INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)");
        $stmt_item->bind_param("iiid", $order_id, $item['id'], $item['quantity'], $item['price']);
        $stmt_item->execute();

        // Update stock
        $stmt_stock = $connection->prepare("UPDATE products SET qty = qty - ? WHERE id = ?");
        $stmt_stock->bind_param("ii", $item['quantity'], $item['id']);
        $stmt_stock->execute();
    }

    // Commit
    $connection->commit();
    echo json_encode(["status" => "success", "message" => "Order placed successfully", "order_id" => $order_id]);

} catch (Exception $e) {
    // Rollback on error
    $connection->rollback();
    echo json_encode(["status" => "error", "message" => "Error: " . $e->getMessage()]);
}