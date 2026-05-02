<?php
require_once '../../cors.php';
require_once __DIR__ . '/../../config/db.php'; 
require_once __DIR__ . '/../../auth/auth.php';

// ده المصدر الوحيد والآمن للـ user_id
$user_id = getAuthenticatedUserId($pdo);

header('Content-Type: application/json');

// استقبال البيانات (الـ action والـ id والـ quantity فقط)
$input = json_decode(file_get_contents("php://input"), true);
$action = $input['action'] ?? $_POST['action'] ?? '';
$id = $input['id'] ?? $_POST['id'] ?? 0;

try {
    // 2. معالجة الإضافة (Add)
    if ($action == 'add') {
        // حذفنا استخراج الـ user_id من الـ input نهائياً عشان الأمان
        $product_id = $input['product_id'] ?? $_POST['product_id'] ?? null;

        if (!$product_id) throw new Exception("بيانات المنتج غير مكتملة");

        // استخدمنا $user_id اللي جاي من التوكين فوق (سطر 7)
        $stmt = $pdo->prepare("INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, 1) 
                                ON DUPLICATE KEY UPDATE quantity = quantity + 1");
        $stmt->execute([$user_id, $product_id]);
        
        echo json_encode(['status' => 'success', 'message' => 'تمت الإضافة للسلة']);
    }

    // 3. معالجة الحذف (Delete)
    elseif ($action == 'delete') {
        if (!$id) throw new Exception("معرف المنتج مفقود");
        
        // الأفضل تتأكد إن المنتج ده يخص اليوزر ده فعلاً قبل الحذف (زيادة أمان)
        $stmt = $pdo->prepare("DELETE FROM cart WHERE id = ? AND user_id = ?");
        $stmt->execute([$id, $user_id]);
        
        echo json_encode(['status' => 'success', 'message' => 'تم الحذف']);
    }

    // 4. معالجة التعديل (Update)
    elseif ($action == 'update') {
        $new_qty = $input['quantity'] ?? $_POST['quantity'] ?? 1;
        if ($new_qty < 1) $new_qty = 1;
        
        // برضه نتأكد إن المنتج ده يخص اليوزر ده قبل التعديل
        $stmt = $pdo->prepare("UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?");
        $stmt->execute([$new_qty, $id, $user_id]);
        
        echo json_encode(['status' => 'success', 'message' => 'تم التحديث']);
    }

    else {
        throw new Exception("إجراء غير معروف");
    }

} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>