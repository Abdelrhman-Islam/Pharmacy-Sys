<?php
require_once '../../config/db.php'; 
require_once '../../auth/auth.php';
require_once '../../cors.php';

header('Content-Type: application/json');

$user_id = getAuthenticatedUserId($pdo); 

try {
    $stmt = $pdo->prepare("SELECT id, total_amount, status, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC");
    $stmt->execute([$user_id]);
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["status" => "success", "data" => $orders]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "فشل جلب الطلبات"]);
}