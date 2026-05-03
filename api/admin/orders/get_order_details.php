<?php
require_once '../../../cors.php';
require_once '../../../config/db.php';
require_once '../../../middleware/admin_middleware.php';
confirmAdmin($connection);

// التأكد من وجود الـ ID
$order_id = $_GET['id'] ?? null;

if (!$order_id) {
    echo json_encode(["status" => "error", "message" => "Missing Order ID"]);
    exit;
}

// استخدام Prepared Statement للـ Security
$stmt = $connection->prepare("
    SELECT oi.*, p.name as product_name 
    FROM order_items oi 
    JOIN products p ON oi.product_id = p.id 
    WHERE oi.order_id = ?
");
$stmt->bind_param("i", $order_id);
$stmt->execute();
$result = $stmt->get_result();

$items = [];
while ($row = $result->fetch_assoc()) {
    $items[] = $row;
}

echo json_encode(["status" => "success", "data" => $items]);
$stmt->close();
$connection->close();
?>