<?php
$host = "localhost";
$user = "root";
$password = "";
$db_name = "pharmacy";

try {
    // 1. Connect using mysqli (Required for existing middleware)
    $connection = new mysqli($host, $user, $password, $db_name);
    
    if ($connection->connect_error) {
        throw new Exception("mysqli Connection failed: " . $connection->connect_error);
    }
    $connection->set_charset("utf8mb4");

    // 2. Connect using PDO (For complex database operations)
    $pdo = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8mb4", $user, $password);
    
    // Set PDO error mode to exceptions
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

} catch (Exception $e) {
    // Handle connection errors as JSON
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database Error: " . $e->getMessage()]);
    exit;
}