<?php
require_once '../../cors.php';
require_once __DIR__ . '/../../middleware/admin_middleware.php';
require_once __DIR__ . '/../../config/db.php'; 

$user = confirmUser($connection); // دالة بتجيب بيانات الـ User من التوكن
$user_id = $user['id'];

$stmt = $connection->prepare("SELECT name, phone, address, city FROM users WHERE id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
echo json_encode($stmt->get_result()->fetch_assoc());