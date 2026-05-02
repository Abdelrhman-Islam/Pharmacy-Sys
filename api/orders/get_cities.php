<?php
require_once '../../config/db.php'; // تأكد إنك بتستخدم نفس مسار الـ db
require_once '../../cors.php';
header('Content-Type: application/json');

try {
    // استخدم $pdo زي ما أنت مستخدم في checkout.php عشان التوحيد
    $stmt = $pdo->query("SELECT DISTINCT city FROM users WHERE city IS NOT NULL AND city != ''");
    $cities = $stmt->fetchAll(PDO::FETCH_COLUMN);

    echo json_encode(["status" => "success", "data" => $cities]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "فشل جلب المدن"]);
}
?>