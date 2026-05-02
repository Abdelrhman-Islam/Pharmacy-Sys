<?php
// Prevent HTML output for React
ini_set('display_errors', 0); 
header('Content-Type: application/json; charset=UTF-8');

require_once __DIR__ . '/../../config/db.php'; 
require_once __DIR__ . '/../../middleware/admin_middleware.php';
require_once '../../cors.php';
confirmAdmin($connection); 

try {
    // Middleware check
    $adminData = confirmAdmin($connection);

    // Fetch latest users
    $sql = "SELECT id, name, email, phone, created_at FROM users WHERE type = 'user' ORDER BY id DESC LIMIT 10";
    
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
    // Return errors as JSON
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}