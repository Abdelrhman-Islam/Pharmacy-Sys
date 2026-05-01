<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents("php://input");
    $data = json_decode($input, true);

    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';

    if (empty($email) || empty($password)) {
        echo json_encode(["status" => "error", "message" => "يرجى ملء جميع الحقول"]);
        exit;
    }

    $stmt = $connection->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($user = $result->fetch_assoc()) {
        if (password_verify($password, $user['password'])) {
            
            $token = bin2hex(random_bytes(32));
            $user_id = $user['id'];
            $account_type = $user['type']; // تأكد إن الحقل ده موجود في جدول users
            $expires_at = date('Y-m-d H:i:s', strtotime('+7 days'));

            $token_stmt = $connection->prepare("INSERT INTO tokens (user_id, token, purpose, expires_at) VALUES (?, ?, 'auth', ?)");
            $token_stmt->bind_param("iss", $user_id, $token, $expires_at);
            
            if ($token_stmt->execute()) {
                unset($user['password']);
                
                echo json_encode([
                    "status" => "success",
                    "message" => "تم تسجيل الدخول بنجاح",
                    "token" => $token,
                    "user" => $user 
                ]);
            }
        }

        else {
            echo json_encode(["status" => "error", "message" => "البريد الإلكتروني أو كلمة المرور غير صحيحة"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "البريد الإلكتروني أو كلمة المرور غير صحيحة"]);
    }
}