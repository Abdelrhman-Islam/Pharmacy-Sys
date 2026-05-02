<?php
// auth_middleware.php
require_once __DIR__ . '/../config/db.php'; 

function checkAuth($connection) {
    // 1. Extract Headers
    $headers = getallheaders();
    $rawToken = $headers['Authorization'] ?? '';
    $token = preg_replace('/^Bearer\s+/i', '', $rawToken);
    if (empty($token)) {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Unauthorized access"]);
        exit;
    }

    // 2. Validate token against database
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
        // Token is valid, return user_id for further queries
        return $user_data['user_id'];
    } else {
        // Token invalid or expired
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Session expired, please log in again"]);
        exit;
    }
}