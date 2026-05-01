<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once '../../cors.php';
require_once __DIR__ . '/../../middleware/admin_middleware.php';
require_once __DIR__ . '/../../config/db.php'; 

confirmAdmin($connection); // الحماية أولاً

$stats = [];

// 1. إجمالي المنتجات
$res = $connection->query("SELECT COUNT(*) as total FROM products");
$stats['total_products'] = $res->fetch_assoc()['total'];

// 2. إجمالي المستخدمين
$res = $connection->query("SELECT COUNT(*) as total FROM users WHERE type = 'user'");
$stats['total_users'] = $res->fetch_assoc()['total'];

$res = $connection->query("SELECT COUNT(*) as total FROM products WHERE qty < 10");
$stats['low_stock'] = $res->fetch_assoc()['total'];

echo json_encode(["status" => "success", "data" => $stats]);