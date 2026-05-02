<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once '../../cors.php';
require_once __DIR__ . '/../../middleware/admin_middleware.php';
require_once __DIR__ . '/../../config/db.php'; 

confirmAdmin($connection); // Authorize admin

$stats = [];

// Total products
$res = $connection->query("SELECT COUNT(*) as total FROM products");
$stats['total_products'] = $res->fetch_assoc()['total'];

// Total users
$res = $connection->query("SELECT COUNT(*) as total FROM users WHERE type = 'user'");
$stats['total_users'] = $res->fetch_assoc()['total'];

// Low stock products
$res = $connection->query("SELECT COUNT(*) as total FROM products WHERE qty < 10");
$stats['low_stock'] = $res->fetch_assoc()['total'];

echo json_encode(["status" => "success", "data" => $stats]);