<?php
// 1. أهم سطرين عشان الـ React ما يشفش HTML
ini_set('display_errors', 0); 
header('Content-Type: application/json; charset=UTF-8');

require_once __DIR__ . '/../../config/db.php'; 
require_once __DIR__ . '/../../middleware/admin_middleware.php';
require_once '../../cors.php';
confirmAdmin($connection); 

try {
    // 2. تشغيل الميدل وير
    $adminData = confirmAdmin($connection);

    // 3. الكويري (تأكد من أسماء الأعمدة عندك)
    // لو مش متأكد من created_at جرب id حالياً
    $sql = "SELECT id, name, email, created_at FROM users WHERE type = 'user' ORDER BY id DESC LIMIT 5";
    
    $result = $connection->query($sql);

    if (!$result) {
        throw new Exception("Query Failed: " . $connection->error);
    }

    $users = [];
    while($row = $result->fetch_assoc()) {
        $users[] = $row;
    }

    echo json_encode([
        "status" => "success",
        "data" => $users
    ]);

} catch (Exception $e) {
    // لو حصل أي خطأ، بنرجعه كـ JSON مش كـ HTML
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}