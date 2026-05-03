<?php
header("Content-Type: application/json");
require_once '../../../cors.php';
require_once '../../../config/db.php';
require_once '../../../middleware/admin_middleware.php';

confirmAdmin($connection);

$data = json_decode(file_get_contents("php://input"), true);

$order_id = $data['order_id'] ?? null;
$status = $data['status'] ?? null;

$allowed = ['pending', 'in_transit', 'completed', 'cancelled'];

if (!$order_id || !in_array($status, $allowed)) {
    http_response_code(400);
    echo json_encode(["message" => "Invalid data"]);
    exit;
}

$stmt = $connection->prepare("UPDATE orders SET status = ? WHERE id = ?");
$stmt->bind_param("si", $status, $order_id);

if ($stmt->execute()) {
    echo json_encode(["status" => "success"]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Update failed"]);
}

$stmt->close();
$connection->close();
?>