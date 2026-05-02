<?php
// ملف لإعادة استخدام كود التحقق من التوكين
function getAuthenticatedUserId($pdo) {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? '';

    if (empty($authHeader) || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized: No token provided']);
        exit;
    }

    $tokenValue = $matches[1];
    $stmt = $pdo->prepare("SELECT user_id FROM tokens WHERE token = ? LIMIT 1");
    $stmt->execute([$tokenValue]);
    $tokenData = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$tokenData) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid or expired token']);
        exit;
    }

    return $tokenData['user_id'];
}
?>