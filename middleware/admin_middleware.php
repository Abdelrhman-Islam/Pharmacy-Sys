<?php
// Prevent direct access
if (basename(__FILE__) == basename($_SERVER['SCRIPT_FILENAME'])) {
    exit('No direct access allowed');
}

function confirmAdmin($connection) {
    // Get and normalize headers
    $headers = array_change_key_case(getallheaders(), CASE_LOWER);
    $authHeader = $headers['authorization'] ?? '';

    if (empty($authHeader)) {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Token required"]);
        exit;
    }

    // Extract token
    $token = preg_replace('/^Bearer\s+/i', '', $authHeader);

    // Validate token and admin status
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

    // Check if admin is valid
    if (!$admin) {
        http_response_code(403);
        echo json_encode(["status" => "error", "message" => "Unauthorized or session expired"]);
        exit;
    }

    // Return admin data
    return $admin;
}