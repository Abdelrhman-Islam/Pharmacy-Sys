<?php
require_once '../../cors.php';
// 1. استخدم ملف الـ Auth العادي مش بتاع الأدمن
require_once __DIR__ . '/../../middleware/auth_middleware.php'; 
require_once __DIR__ . '/../../config/db.php'; 

// 2. استخدم الدالة الصح الموجودة في الملف ده (checkAuth)
$user_id = checkAuth($connection); 

// 3. كمل الكود بتاعك عادي
$stmt = $connection->prepare("SELECT name, phone, address, city FROM users WHERE id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();

$result = $stmt->get_result()->fetch_assoc();

echo json_encode(["status" => "success", "data" => $result]);
?>