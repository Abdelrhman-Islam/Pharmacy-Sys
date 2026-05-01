<?php
// إعدادات الـ CORS والـ DB
require_once '../../cors.php';
require_once __DIR__ . '/../../config/db.php'; 


// استقبال بيانات الـ JSON
$json = file_get_contents("php://input");
$data = json_decode($json, true);

if (!$data) {
    echo json_encode(["status" => "error", "message" => "بيانات الطلب غير صالحة"]);
    exit;
}

// البدء بعملية الـ Transaction
$connection->begin_transaction();

try {
    // 1. إدخال الطلب الأساسي
    // بافترض إن user_id = 1 مؤقتاً لحد ما نربط السيشن
    $user_id = 1; 
    $stmt = $connection->prepare("INSERT INTO orders (user_id, total_amount, address, phone, city) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("idsss", $user_id, $data['total'], $data['address'], $data['phone'], $data['city']);
    $stmt->execute();
    $order_id = $connection->insert_id;

    // 2. إدخال تفاصيل المنتجات وخصم المخزون
    foreach ($data['cartItems'] as $item) {
        // إدخال المنتج في جدول التفاصيل
        $stmt_item = $connection->prepare("INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)");
        $stmt_item->bind_param("iiid", $order_id, $item['id'], $item['quantity'], $item['price']);
        $stmt_item->execute();

        // تحديث المخزون
        $stmt_stock = $connection->prepare("UPDATE products SET qty = qty - ? WHERE id = ?");
        $stmt_stock->bind_param("ii", $item['quantity'], $item['id']);
        $stmt_stock->execute();
    }

    // تأكيد العمليات
    $connection->commit();
    echo json_encode(["status" => "success", "message" => "تم الطلب بنجاح", "order_id" => $order_id]);

} catch (Exception $e) {
    // التراجع عن أي خطأ
    $connection->rollback();
    echo json_encode(["status" => "error", "message" => "حدث خطأ: " . $e->getMessage()]);
}
?>