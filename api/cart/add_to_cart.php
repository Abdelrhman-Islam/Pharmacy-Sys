<?php
require_once '../../cors.php';
require_once __DIR__ . '/../../config/db.php'; 
header('Content-Type: application/json'); // مهم جداً


try {
    $data = json_decode(file_get_contents("php://input"), true);
    
    // تأكد إن الداتا وصلت
    if (!isset($data['product_id']) || !isset($data['user_id'])) {
        throw new Exception("بيانات غير مكتملة");
    }

    // هنا الكويري بتاعتك
    $stmt = $pdo->prepare("INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, 1) 
                           ON DUPLICATE KEY UPDATE quantity = quantity + 1");
    $stmt->execute([$data['user_id'], $data['product_id']]);

    echo json_encode(['status' => 'success', 'message' => 'تمت الإضافة']);

} catch (Exception $e) {
    // لو حصل أي خطأ، بنبعته كـ JSON بدل ما نبعته كـ HTML
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>