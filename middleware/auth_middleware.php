<?php
// auth_middleware.php
require_once 'db.php';

function checkAuth($connection) {
    // 1. استخراج الـ Headers
    $headers = getallheaders();
    $token = $headers['Authorization'] ?? '';

    if (empty($token)) {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "غير مصرح لك بالدخول"]);
        exit;
    }

    $stmt = $connection->prepare("
        SELECT user_id 
        FROM tokens 
        WHERE token = ? 
        AND purpose = 'auth' 
        AND expires_at > NOW() 
        LIMIT 1
    ");
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($user_data = $result->fetch_assoc()) {
        // التوكن صح وموجود.. رجع الـ user_id عشان تستخدمه في الكويريز اللي جاية
        return $user_data['user_id'];
    } else {
        // التوكن غلط أو منتهي الصلاحية
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "جلسة الدخول انتهت، سجل دخول تاني"]);
        exit;
    }
}