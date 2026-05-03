<?php
header("Content-Type: application/json");
require_once '../../../cors.php';
require_once '../../../config/db.php';
require_once '../../../middleware/admin_middleware.php';

confirmAdmin($connection);

try {
    $sql = "
        SELECT 
            o.id,
            o.status,
            o.total_amount,
            o.created_at,
            COALESCE(u.name, o.name) AS customer_name
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        ORDER BY o.id DESC
        LIMIT 5
    ";

    $result = $connection->query($sql);

    $orders = [];
    while ($row = $result->fetch_assoc()) {
        $orders[] = $row;
    }

    echo json_encode([
        "status" => "success",
        "orders" => $orders
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}

$connection->close();
?>