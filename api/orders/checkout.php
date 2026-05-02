<?php
require_once __DIR__ . '/../../config/db.php'; 
require_once __DIR__ . '/../../auth/auth.php'; 
require_once '../../cors.php';

header('Content-Type: application/json');

$user_id = getAuthenticatedUserId($pdo); 

// 1. استقبال البيانات من الـ Postman أو الـ React
$input = json_decode(file_get_contents('php://input'), true);

$name = $input['name'] ?? '';
$phone = $input['phone'] ?? '';
$address = $input['address'] ?? '';
$city = $input['city'] ?? '';

if (empty($name) || empty($address)) {
    echo json_encode(["status" => "error", "message" => "بيانات الشحن ناقصة"]);
    exit;
}

try {
    $pdo->beginTransaction();

    // 1. جلب السلة
    // 1. جلب السلة (مع عمل JOIN لجدول المنتجات لجلب السعر)
    $stmt = $pdo->prepare("
        SELECT c.product_id, c.quantity, p.price 
        FROM cart c 
        JOIN products p ON c.product_id = p.id 
        WHERE c.user_id = ?
    ");
    $stmt->execute([$user_id]);
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($items)) {
        throw new Exception("السلة فارغة");
    }
    $total_amount = array_sum(array_map(fn($item) => $item['price'] * $item['quantity'], $items));

    // 2. تعديل الـ Query عشان تشيل بيانات الشحن (تأكد إن الأعمدة موجودة في جدول orders)
    $stmt = $pdo->prepare("INSERT INTO orders (user_id, total_amount, name, phone, address, city, status) VALUES (?, ?, ?, ?, ?, ?, 'pending')");
    $stmt->execute([$user_id, $total_amount, $name, $phone, $address, $city]);
    $order_id = $pdo->lastInsertId();

    // 3. باقي الكود زي ما هو
    $stmt = $pdo->prepare("INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)");
    foreach ($items as $item) {
        $stmt->execute([$order_id, $item['product_id'], $item['quantity'], $item['price']]);
    }

    $pdo->prepare("DELETE FROM cart WHERE user_id = ?")->execute([$user_id]);

    $pdo->commit();
    echo json_encode(["status" => "success", "order_id" => $order_id]);

} catch (Exception $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}

