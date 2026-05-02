<?php
require_once '../../cors.php'; 
require_once '../../middleware/admin_middleware.php';
require_once __DIR__ . '/../../config/db.php'; 

confirmAdmin($connection); // Verify admin access

$sql = "SELECT * FROM products ORDER BY created_at DESC";
$result = $connection->query($sql);

$products = [];
while($row = $result->fetch_assoc()) {
    $products[] = $row;
}

echo json_encode(["status" => "success", "data" => $products]);