<?php
$host = "localhost";
$user = "root";
$password = "";
$db_name = "pharmacy";

try {
    // 1. الاتصال باستخدام mysqli (عشان الـ Middleware اللي كتبناه شغال بيه)
    $connection = new mysqli($host, $user, $password, $db_name);
    
    if ($connection->connect_error) {
        throw new Exception("mysqli Connection failed: " . $connection->connect_error);
    }
    $connection->set_charset("utf8mb4");

    // 2. الاتصال باستخدام PDO (لو حبيت تستخدمه في عمليات الـ INSERT المعقدة)
    $pdo = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8mb4", $user, $password);
    
    // ضبط الـ PDO عشان يطلع Errors واضحة بدل ما يسكت
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

} catch (Exception $e) {
    // لو حصل مشكلة في السيرفر يطلع رد JSON عشان الـ React ميهنجش
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database Error: " . $e->getMessage()]);
    exit;
}