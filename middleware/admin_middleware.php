<?php
// منع الوصول المباشر للملف (لأمان أكتر)
if (basename(__FILE__) == basename($_SERVER['SCRIPT_FILENAME'])) {
    exit('No direct access allowed');
}

function confirmAdmin($connection) {
    // 1. جلب الـ headers وتوحيدها
    $headers = array_change_key_case(getallheaders(), CASE_LOWER);
    $authHeader = $headers['authorization'] ?? '';

    if (empty($authHeader)) {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "فين التوكن يا هندسة؟"]);
        exit;
    }

    // 2. تنظيف التوكن (شيل كلمة Bearer والمسافة اللي بعدها)
    // بنستخدم regex عشان نضمن إننا بنشيلها صح مهما كان شكل المسافات
    $token = preg_replace('/^Bearer\s+/i', '', $authHeader);

    // 3. الكويري عشان نتأكد من التوكن وصلاحية الأدمن
    // بنعمل JOIN عشان نتأكد إن التوكن سليم واليوزر نوعه admin في خطوة واحدة
    $sql = "SELECT users.id, users.name, users.email 
            FROM tokens 
            JOIN users ON tokens.user_id = users.id 
            WHERE tokens.token = ? 
            AND users.type = 'admin' 
            AND tokens.expires_at > NOW() 
            LIMIT 1";
    
    $stmt = $connection->prepare($sql);
    if (!$stmt) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Internal Server Error"]);
        exit;
    }

    $stmt->bind_param("s", $token);
    $stmt->execute();
    $result = $stmt->get_result();
    $admin = $result->fetch_assoc();

    // 4. لو مالقاش أدمن بالتوكن ده أو التوكن منتهي
    if (!$admin) {
        http_response_code(403);
        echo json_encode(["status" => "error", "message" => "أنت مش أدمن أو الجلسة انتهت!"]);
        exit;
    }

    // رجع بيانات الأدمن عشان لو احتجت تستخدمها في الـ API (زي الـ ID مثلاً)
    return $admin;
}