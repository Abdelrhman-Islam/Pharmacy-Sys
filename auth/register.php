<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once '../config/db.php'; 

// لو الطلب OPTIONS (بسبب الـ CORS) بنقفل هنا
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

// استقبال الـ JSON من React
$input = file_get_contents("php://input");
$data = json_decode($input, true);



if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $email = $data['email'] ?? '';

    // تشيك لو الإيميل موجود
    $stmt = $connection->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    
    if ($stmt->get_result()->num_rows > 0) {
        // بنبعت الرد بشكل احترافي يحدد فين المشكلة بالظبط
        echo json_encode([
            "status" => "error",
            "errors" => [
                "email" => "This E-Mail already Exist !"
            ]
        ]);
        exit;
    }
    $name = $data['name'] ?? '';
    $email = $data['email'] ?? '';
    $password = password_hash($data['password'], PASSWORD_DEFAULT);
    $phone = $data['phone'] ?? '';
    $age = $data['age'] ?? '';
    $address = $data['address'] ?? '';
    
    $user_type = 'user'; 

    $stmt = $connection->prepare("INSERT INTO users (name, email, password, phone, age, address, type) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssiss", $name, $email, $password, $phone, $age, $address, $user_type);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Account created!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Registration failed"]);
    }
}